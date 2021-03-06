import { Injectable } from '@nestjs/common';
import { ReviewStoreEntity } from '../entities';
import {
  EventBus,
  Order,
  CustomerService,
  ListQueryBuilder,
  Customer,
  TransactionalConnection
} from '@vendure/core';
import { ReviewService } from '../helpers';
import { DEFAULT_CACHE_TIMEOUT } from '../consts';
import { ReviewStoreStateTransitionEvent } from '../events';

@Injectable()
export class ReviewStoreService extends ReviewService<
  ReviewStoreEntity,
  ReviewStoreStateTransitionEvent
> {
  constructor(
    connection: TransactionalConnection,
    listQueryBuilder: ListQueryBuilder,
    customerService: CustomerService,
    eventBus: EventBus
  ) {
    super(
      connection,
      listQueryBuilder,
      customerService,
      eventBus,
      ReviewStoreEntity,
      ReviewStoreStateTransitionEvent,
      ['customer']
    );
  }

  async findCustomerReview(
    customer: Customer
  ): Promise<ReviewStoreEntity | undefined> {
    return await this.connection
      .getRepository(ReviewStoreEntity)
      .findOne({ customer: customer });
  }

  async getNPSAvg(): Promise<number> {
    const { nps } = await this.connection
      .getRepository(ReviewStoreEntity)
      .createQueryBuilder('review_store')
      .select('AVG(nps)', 'nps')
      .where('state = :state', { state: 'Authorized' })
      .cache(DEFAULT_CACHE_TIMEOUT)
      .getRawOne();
    return nps ? nps : 0;
  }

  async checkIfCustomerIsValidToCreateReviewStore(
    customer: Customer
  ): Promise<boolean> {
    const customerReview = await this.findCustomerReview(customer);

    if (customerReview) {
      return false;
    }

    const countOrders = await this.connection.getRepository(Order).count({
      where: {
        customer: customer,
        active: false
      }
    });

    if (countOrders > 0) {
      return true;
    } else {
      return false;
    }
  }
}
