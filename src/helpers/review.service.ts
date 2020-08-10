import { Connection } from 'typeorm';
import {
  RequestContext,
  ID,
  ListQueryBuilder,
  EventBus,
  Type,
  getEntityOrThrow,
  Customer,
  CustomerService,
  VendureEvent,
  DeepPartial,
  patchEntity
} from '@vendure/core';
import { ReviewState } from './review-state';
import { ListQueryOptions } from '@vendure/core/dist/common/types/common-types';
import { ReviewBaseEntity } from '../entities/review-base.entity';
import { ReviewStateMachine } from './review-state-machine';

/**
 * A generic Review Service to handle all common services of the review
 *
 * To use you need to extend this class
 */
export class ReviewService<
  Et extends ReviewBaseEntity,
  Ev extends VendureEvent
> {
  reviewStateMachine: ReviewStateMachine<Et>;
  constructor(
    protected connection: Connection,
    protected listQueryBuilder: ListQueryBuilder,
    protected customerService: CustomerService,
    protected eventBus: EventBus,
    private entity: Type<Et>,
    private event: Type<Ev>
  ) {
    this.reviewStateMachine = new ReviewStateMachine(entity);
  }

  async create(input: DeepPartial<Et>): Promise<Et> {
    const review = new this.entity({ ...input, state: 'Created' });
    // @ts-ignore
    return await this.connection.getRepository(this.entity).save(review);
  }

  async findAll(
    options?: ListQueryOptions<Et>
  ): Promise<{
    items: Et[];
    totalItems: number;
  }> {
    return await this.listQueryBuilder
      .build(this.entity, options)
      .getManyAndCount()
      .then(([reviews, totalItems]) => {
        return {
          items: reviews,
          totalItems
        };
      });
  }

  async findById(id: ID): Promise<Et> {
    return await getEntityOrThrow(this.connection, this.entity, id);
  }

  async update(input: DeepPartial<Et> & { id: ID }): Promise<Et> {
    const review = await getEntityOrThrow(
      this.connection,
      this.entity,
      input.id
    );
    // @ts-ignore
    return this.connection.getRepository(this.entity).save(
      //@ts-ignore
      patchEntity(review, input)
    );
  }

  async transitionToState(
    ctx: RequestContext,
    id: ID,
    state: ReviewState
  ): Promise<Et> {
    const review = await this.findById(id);
    const fromState = review.state;
    await this.reviewStateMachine.transition(ctx, review, state);
    await this.connection
      .getRepository(this.entity)
      // @ts-ignore
      .save(review, { reload: false });
    this.eventBus.publish(new this.event(fromState, state, ctx, review));
    return review;
  }

  getNextReviewStates(review: Et): readonly ReviewState[] {
    return this.reviewStateMachine.getNextStates(review);
  }

  /** Get Customer in the context of the request */
  protected async getCustomer(
    ctx: RequestContext
  ): Promise<Customer | undefined> {
    const userId = ctx.activeUserId;
    if (!userId) {
      return;
    }

    const customer = await this.customerService.findOneByUserId(userId);

    if (!customer) {
      return;
    }

    return customer;
  }
}
