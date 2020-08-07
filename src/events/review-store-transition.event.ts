import { VendureEvent, RequestContext } from '@vendure/core';
import { ReviewState } from '../helpers/review-state';
import { ReviewStoreEntity } from '../entities/review-store.entity';

/**
 * This event is fired whenever a `ReviewStore` transitions from one `ReviewState` to another
 */
export class ReviewStoreStateTransitionEvent extends VendureEvent {
  constructor(
    public fromState: ReviewState,
    public toState: ReviewState,
    public ctx: RequestContext,
    public reviewStore: ReviewStoreEntity
  ) {
    super();
  }
}
