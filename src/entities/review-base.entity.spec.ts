import { ReviewBaseEntity } from './review-base.entity';

describe('ReviewBaseEntity', () => {
  it('should make a review with basic info', () => {
    const review = new ReviewBaseEntity({
      title: 'Review',
      description: 'Good product',
      state: 'Created'
    });
    expect(review).toBeTruthy();
    expect(review.title).toBe('Review');
    expect(review.description).toBe('Good product');
    expect(review.state).toBe('Created');
  });
});
