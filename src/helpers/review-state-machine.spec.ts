import { ReviewStateMachine } from './review-state-machine';
import { ReviewStoreEntity } from '../entities/review-store.entity';
import { IllegalOperationError } from '@vendure/core';
import { adminCtx } from '../test-helpers';

const reviewStore = new ReviewStoreEntity({
  id: '1',
  title: 'Good Company',
  description: 'Test',
  nps: 10,
  state: 'Created'
});
const reviewStateMachine = new ReviewStateMachine(ReviewStoreEntity);

describe('ReviewStateMachine', () => {
  it('should transit a Review Store Entity from created to authorized', async () => {
    await reviewStateMachine.transition(adminCtx, reviewStore, 'Authorized');
    expect(reviewStore.state).toBe('Authorized');
    expect(reviewStateMachine.getNextStates(reviewStore)).toEqual([
      'Updated',
      'Denied'
    ]);
  });
  it('should transit a Review Store Entity from authorized to created and throw a error', async () => {
    await expect(
      reviewStateMachine.transition(adminCtx, reviewStore, 'Created')
    ).rejects.toThrow(IllegalOperationError);
  });
});
