import {
  RequestContext,
  ID,
  ListQueryBuilder,
  EventBus,
  Type,
  Customer,
  CustomerService,
  DeepPartial,
  patchEntity,
  UnauthorizedError,
  ExtendedListQueryOptions,
  TransactionalConnection
} from '@vendure/core';
import { FindOneOptions } from 'typeorm';
import { ReviewStateTransitionEvent } from '../events/review-state-transition.event';
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
  Ev extends ReviewStateTransitionEvent<Et>
> {
  reviewStateMachine: ReviewStateMachine<Et>;
  constructor(
    protected connection: TransactionalConnection,
    protected listQueryBuilder: ListQueryBuilder,
    protected customerService: CustomerService,
    protected eventBus: EventBus,
    private entity: Type<Et>,
    private event: Type<Ev>,
    private entityRelations: string[]
  ) {
    this.reviewStateMachine = new ReviewStateMachine(entity);
  }

  async create(input: DeepPartial<Et>): Promise<Et> {
    const review = new this.entity({ ...input, state: 'Created' });
    // @ts-ignore
    return await this.connection.getRepository(this.entity).save(review);
  }

  async findAll(
    options?: ListQueryOptions<Et>,
    extendedOptions?: ExtendedListQueryOptions<Et>
  ): Promise<{
    items: Et[];
    totalItems: number;
  }> {
    return await this.listQueryBuilder
      .build(this.entity, options, {
        ...extendedOptions,
        relations: this.entityRelations
      })
      .getManyAndCount()
      .then(([reviews, totalItems]) => {
        return {
          items: reviews,
          totalItems
        };
      });
  }

  async findById(
    ctx: RequestContext,
    id: ID,
    options?: FindOneOptions<Et>
  ): Promise<Et> {
    return await this.connection.getEntityOrThrow(ctx, this.entity, id, {
      ...options,
      relations: this.entityRelations
    });
  }

  async update(
    ctx: RequestContext,
    input: DeepPartial<Et> & { id: ID }
  ): Promise<Et> {
    const review = await this.findById(ctx, input.id);
    // @ts-ignore
    await this.connection.getRepository(this.entity).save(
      //@ts-ignore
      patchEntity(review, input)
    );
    return this.transitionToState(ctx, review, 'Updated');
  }

  async transitionToState(
    ctx: RequestContext,
    review: Et,
    state: ReviewState
  ): Promise<Et> {
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

  async getCustomer(ctx: RequestContext): Promise<Customer | undefined> {
    const userId = ctx.activeUserId;
    if (!userId) {
      return;
    }

    const customer = await this.customerService.findOneByUserId(ctx, userId);

    if (!customer) {
      return;
    }

    return customer;
  }
  async getCustomerOrThrow(ctx: RequestContext): Promise<Customer> {
    const customer = await this.getCustomer(ctx);
    if (!customer) {
      throw new UnauthorizedError();
    }
    return customer;
  }
}
