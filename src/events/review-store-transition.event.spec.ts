import { ReviewStoreStateTransitionEvent } from './review-store-state-transition.event';
import { adminCtx, exampleReviewStore } from '../test-helpers';

describe('ReviewStoreStateTransitionEvent', () => {
  it('should create a event correctly', () => {
    const event = new ReviewStoreStateTransitionEvent(
      'Created',
      'Authorized',
      adminCtx,
      exampleReviewStore
    );

    expect(event).toBeTruthy();
    expect(event.fromState).toBe('Created');
    expect(event.toState).toBe('Authorized');
    expect(event.review).toEqual(exampleReviewStore);
    expect(event.ctx).toEqual(adminCtx);
  });
});
