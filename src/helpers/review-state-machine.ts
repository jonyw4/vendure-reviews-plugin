import {
  RequestContext,
  Type,
  FSM,
  StateMachineConfig,
  IllegalOperationError
} from '@vendure/core';
import { ReviewBaseEntity } from '../entities/review-base.entity';
import { ReviewState, reviewStateTransitions } from './review-state';

/**
 * A Generic Review State Machine to handle changes on review based on an entity extended of ReviewBaseEntity
 */
export class ReviewStateMachine<E extends ReviewBaseEntity> {
  private entity: Type<E>;
  constructor(entity: Type<E>) {
    this.entity = entity;
  }
  private readonly config: StateMachineConfig<
    ReviewState,
    {
      ctx: RequestContext;
      review: E;
    }
  > = {
    transitions: reviewStateTransitions,
    onTransitionStart: async (fromState, toState, data) => {
      return true;
    },
    onTransitionEnd: async (fromState, toState, data) => {
      return;
    },
    onError: (fromState, toState, message) => {
      throw new IllegalOperationError(
        message || 'review.error.cannot-transition-review-from-to',
        {
          fromState,
          toState
        }
      );
    }
  };

  getNextStates(review: E): readonly ReviewState[] {
    const fsm = new FSM(this.config, review.state);
    return fsm.getNextStates();
  }

  async transition(ctx: RequestContext, review: E, state: ReviewState) {
    const fsm = new FSM(this.config, review.state);
    await fsm.transitionTo(state, { ctx, review });
    review.state = state;
  }
}
