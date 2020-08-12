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
  ID
} from '@vendure/core';
import { ReviewService } from '../helpers';
import { ReviewProductStateTransitionEvent } from '../events';
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
      .count({
        relations: ['order', 'productVariant'],
        where: {
          order: {
            customer: customer,
            active: false
          },
          productVariant: {
            productId: product.id
          }
        }
      });
    return countProductBoughtByCustomer > 0;
  }

  async availableProductsToReview(
    customer: Customer,
    options?: ListQueryOptions<Product>
  ) {
    const customerReviews = await this.connection
      .getRepository(ReviewProductEntity)
      .find({
        select: ['id', 'product'],
        where: {
          customer: customer
        }
      });

    const orderLinesWithDistinctProductVariants = await this.listQueryBuilder
      .build(
        OrderLine,
        {},
        {
          relations: ['order', 'productVariant'],
          where: { order: { customer: customer, active: false } }
        }
      )
      .select('productVariant')
      .distinct(true)
      .getMany();

    const availableProductsToReviewIds = orderLinesWithDistinctProductVariants.reduce(
      (value, line) => value.add(line.productVariant.productId),
      new Set<ID>()
    );

    customerReviews.map((r) =>
      availableProductsToReviewIds.delete(r.product.id)
    );

    return await this.listQueryBuilder
      .build(Product, options, {
        where: { id: In([...availableProductsToReviewIds]) }
      })
      .getManyAndCount()
      .then(([products, totalItems]) => {
        return {
          items: products,
          totalItems
        };
      });
  }
}
