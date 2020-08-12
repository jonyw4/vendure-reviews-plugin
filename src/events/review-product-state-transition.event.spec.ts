import { ReviewProductStateTransitionEvent } from './review-product-state-transition.event';
import { adminCtx, exampleReviewProduct } from '../test-helpers';

describe('ReviewProductStateTransitionEvent', () => {
  it('should create a event correctly', () => {
    const event = new ReviewProductStateTransitionEvent(
      'Created',
      'Authorized',
      adminCtx,
      exampleReviewProduct
    );

    expect(event).toBeTruthy();
    expect(event.fromState).toBe('Created');
    expect(event.toState).toBe('Authorized');
    expect(event.review).toEqual(exampleReviewProduct);
    expect(event.ctx).toEqual(adminCtx);
  });
});
