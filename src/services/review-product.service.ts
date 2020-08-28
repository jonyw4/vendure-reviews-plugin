import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, In } from 'typeorm';
import { ReviewProductEntity } from '../entities';
import {
  EventBus,
  CustomerService,
  ListQueryBuilder,
  OrderLine,
  Customer,
  Product,
  ID,
  translateDeep,
  RequestContext
} from '@vendure/core';
import { ReviewService } from '../helpers';
import { ReviewProductStateTransitionEvent } from '../events';
import { DEFAULT_CACHE_TIMEOUT } from '../consts';
import { ListQueryOptions } from '@vendure/core/dist/common/types/common-types';

@Injectable()
export class ReviewProductService extends ReviewService<
  ReviewProductEntity,
  ReviewProductStateTransitionEvent
> {
  constructor(
    @InjectConnection() connection: Connection,
    listQueryBuilder: ListQueryBuilder,
    customerService: CustomerService,
    eventBus: EventBus
  ) {
    super(
      connection,
      listQueryBuilder,
      customerService,
      eventBus,
      ReviewProductEntity,
      ReviewProductStateTransitionEvent,
      ['customer', 'product']
    );
  }

  async getAvgStars(): Promise<number> {
    const { stars } = await this.connection
      .getRepository(ReviewProductEntity)
      .createQueryBuilder('review_product')
      .select('AVG(stars)', 'stars')
      .where('state = :state', { state: 'Authorized' })
      .cache(DEFAULT_CACHE_TIMEOUT)
      .getRawOne();
    return stars ? stars : 0;
  }

  async getProductOrThrow(id: ID): Promise<Product> {
    return this.connection.getRepository(Product).findOneOrFail(id);
  }

  async checkIfCustomerIsValidToCreateReviewProduct(
    customer: Customer,
    product: Product
  ): Promise<boolean> {
    const countReviewProduct = await this.connection
      .getRepository(ReviewProductEntity)
      .count({
        where: {
          customer: customer,
          product: product
        }
      });

    if (countReviewProduct > 0) {
      return false;
    }

    const countProductBoughtByCustomer = await this.connection
      .getRepository(OrderLine)
      .createQueryBuilder('order_line')
      .select('id')
      .leftJoin('order_line.order', 'order')
      .leftJoin('order_line.productVariant', 'productVariant')
      .andWhere('order.active = false')
      .andWhere('productVariant.productId = :productId', {
        productId: product.id
      })
      .andWhere('order.customer = :customerId', { customerId: customer.id })
      .getCount();

    return countProductBoughtByCustomer > 0;
  }

  async availableProductsToReview(
    ctx: RequestContext,
    customer: Customer,
    options?: ListQueryOptions<Product>
  ) {
    // Separate the query in two parts. First to get the customer review
    const customerReviewQb = await this.connection
      .getRepository(ReviewProductEntity)
      .createQueryBuilder('review_product')
      .select('review_product.productId', 'productId')
      .where('customerId = :customerId', { customerId: customer.id });

    // Now we get all products to review based on the products that the user bought and didn't review
    const availableProductsToReview = await this.connection
      .getRepository(OrderLine)
      .createQueryBuilder('order_line')
      .distinct(true)
      .select('productVariant.productId', 'productId')
      .leftJoin('order_line.order', 'order')
      .leftJoin('order_line.productVariant', 'productVariant')
      .andWhere('order.customer = :customerId', { customerId: customer.id })
      .andWhere('order.active = false')
      .andWhere(
        `productVariant.productId NOT IN (${customerReviewQb.getQuery()})`
      )
      .setParameters(customerReviewQb.getParameters())
      .cache(DEFAULT_CACHE_TIMEOUT)
      .getRawMany<{
        productId: ID;
      }>();

    const availableProductsToReviewIds = availableProductsToReview.reduce(
      (value, item) => [...value, item.productId],
      <Array<ID>>[]
    );

    return await this.listQueryBuilder
      .build(Product, options, {
        relations: [
          'featuredAsset',
          'assets',
          'channels',
          'facetValues',
          'facetValues.facet'
        ],
        channelId: ctx.channelId,
        where: { deletedAt: null, id: In(availableProductsToReviewIds) }
      })
      .getManyAndCount()
      .then(async ([products, totalItems]) => {
        const items = products.map((product) =>
          translateDeep(product, ctx.languageCode, [
            'facetValues',
            ['facetValues', 'facet']
          ])
        );
        return {
          items,
          totalItems
        };
      });
  }
}
