import { examplesReviewProduct } from '../test-helpers';

describe('ReviewProductEntity', () => {
  it('should test a review product with basic info', () => {
    const review = examplesReviewProduct[0];
    expect(review).toBeTruthy();
    expect(review.title).toBe('Review 1');
    expect(review.description).toBe('Good product');
    expect(review.state).toBe('Created');
    expect(review.stars).toBe(5);
    expect(review.customerNameIsPublic).toBe(true);
    expect(review.customer.firstName).toBe('Jony');
    expect(review.product.name).toBe('Laptop');
  });
  it('should test a review product with anonymous customer', () => {
    const review = examplesReviewProduct[2];
    expect(review).toBeTruthy();
    expect(review.title).toBe('Review 3');
    expect(review.description).toBe('Bad');
    expect(review.state).toBe('Created');
    expect(review.stars).toBe(3);
    expect(review.customerNameIsPublic).toBe(false);
    expect(review.customer.firstName).toBe('Any');
    expect(review.customerName).toBe(null);
  });
});
