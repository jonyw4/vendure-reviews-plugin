import { examplesReviewStore } from '../test-helpers';

describe('ReviewStoreEntity', () => {
  it('should test a review store with basic info', () => {
    const review = examplesReviewStore[0];
    expect(review).toBeTruthy();
    expect(review.title).toBe('Review 1');
    expect(review.description).toBe('Good company');
    expect(review.state).toBe('Created');
    expect(review.nps).toBe(9);
    expect(review.customer.firstName).toBe('Jony');
    expect(review.customerName).toBe('Jony');
  });

  it('should test a review store with anonymous customer', () => {
    const review = examplesReviewStore[2];
    expect(review).toBeTruthy();
    expect(review.title).toBe('Review 3');
    expect(review.description).toBe('Bad');
    expect(review.state).toBe('Created');
    expect(review.nps).toBe(8);
    expect(review.customerNameIsPublic).toBe(false);
    expect(review.customer.firstName).toBe('Any');
    expect(review.customerName).toBe(null);
  });
});
