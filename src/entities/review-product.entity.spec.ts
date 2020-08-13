import { exampleReviewProduct } from '../test-helpers';

describe('ReviewProductEntity', () => {
  it('should make a review product with basic info', () => {
    const reviewProduct = exampleReviewProduct;
    expect(reviewProduct).toBeTruthy();
    expect(reviewProduct.title).toBe('Review 1');
    expect(reviewProduct.description).toBe('Good product');
    expect(reviewProduct.state).toBe('Created');
    expect(reviewProduct.stars).toBe(5);
    expect(reviewProduct.customer.firstName).toBe('Jony');
    expect(reviewProduct.product.name).toBe('Laptop');
  });
});
