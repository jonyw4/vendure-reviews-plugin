import { ReviewStateTransitionEvent } from './review-state-transition.event';
import { ReviewStoreEntity } from 'src/entities';

export class ReviewStoreStateTransitionEvent extends ReviewStateTransitionEvent<
  ReviewStoreEntity
> {}
