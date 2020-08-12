import { ReviewStateTransitionEvent } from './review-state-transition.event';
import { ReviewProductEntity } from 'src/entities';

export class ReviewProductStateTransitionEvent extends ReviewStateTransitionEvent<
  ReviewProductEntity
> {}
