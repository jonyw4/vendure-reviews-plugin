import { ReviewStoreAdminResolver } from './review-store.resolver';
import { TestingModule, Test } from '@nestjs/testing';
import { ReviewStoreService } from '../../../services/review-store.service';
import {
  exampleReviewStore,
  examplesReviewStore,
  adminCtx
} from '../../../test-helpers';
import { createMock } from '@golevelup/nestjs-testing';

describe('ReviewStoreAdminResolver', () => {
  let resolver: ReviewStoreAdminResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewStoreAdminResolver,
        {
          provide: ReviewStoreService,
          useValue: createMock<ReviewStoreService>({
            getNPSAvg: async () => 9,
            findById: async () => exampleReviewStore,
            findAll: async () => ({
              items: examplesReviewStore,
              totalItems: 3
            }),
            transitionToState: async () => exampleReviewStore,
            getNextReviewStates: () => ['Created']
          })
        }
      ]
    }).compile();
    resolver = module.get<ReviewStoreAdminResolver>(ReviewStoreAdminResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('reviewStore', () => {
    it('should get a review properly', async () => {
      await expect(resolver.reviewStore({ id: '1' })).resolves.toBe(
        exampleReviewStore
      );
    });
  });
  describe('reviewsStore', () => {
    it('should get a review list properly', async () => {
      await expect(resolver.reviewsStore({})).resolves.toEqual({
        items: examplesReviewStore,
        totalItems: 3
      });
    });
  });
  describe('avgReviewStore', () => {
    it('should get the reviews NPS Average', async () => {
      await expect(resolver.avgReviewStore()).resolves.toBe(9);
    });
  });
  describe('transitionReviewStoreToState', () => {
    it('should change state properly', async () => {
      await expect(
        resolver.transitionReviewStoreToState(adminCtx, {
          id: '1',
          state: 'Created'
        })
      ).resolves.toBe(exampleReviewStore);
    });
  });
  describe('nextStates', () => {
    it('should get the next states', async () => {
      await expect(resolver.nextStates(exampleReviewStore)).resolves.toEqual([
        'Created'
      ]);
    });
  });
});
