import { exampleReviewStore } from '../test-helpers';

describe('ReviewStoreEntity', () => {
  it('should make a review store with basic info', () => {
    const reviewStore = exampleReviewStore;
    expect(reviewStore).toBeTruthy();
    expect(reviewStore.title).toBe('Review 1');
    expect(reviewStore.description).toBe('Good company');
    expect(reviewStore.state).toBe('Created');
    expect(reviewStore.nps).toBe(9);
    expect(reviewStore.customer.firstName).toBe('Jony');
  });
});
