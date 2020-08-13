import { VendureEvent, RequestContext } from '@vendure/core';
import { ReviewState } from '../helpers/review-state';
import { ReviewBaseEntity } from '../entities/review-base.entity';

/**
 * This event is fired whenever a `Review` transitions from one `ReviewState` to another
 */
export abstract class ReviewStateTransitionEvent<
  Et extends ReviewBaseEntity
> extends VendureEvent {
  constructor(
    public fromState: ReviewState,
    public toState: ReviewState,
    public ctx: RequestContext,
    public review: Et
  ) {
    super();
  }
}
