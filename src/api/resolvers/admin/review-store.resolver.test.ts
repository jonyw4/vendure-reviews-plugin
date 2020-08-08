import { ReviewStoreAdminResolver } from './review-store.resolver';
import { TestingModule, Test } from '@nestjs/testing';
import { ReviewStoreService } from '../../../services/review-store.service';
import {
  exampleReviewStore,
  examplesReviewStore,
  adminCtx
} from '../../../test-helpers';

describe('ReviewStoreAdminResolver', () => {
  let resolver: ReviewStoreAdminResolver;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewStoreAdminResolver,
        {
          provide: ReviewStoreService,
          useFactory: () => ({
            getNPSAvg: jest.fn(() => 9),
            findById: jest.fn(() => exampleReviewStore),
            findAll: jest.fn(() => examplesReviewStore),
            transitionToState: jest.fn(() => exampleReviewStore)
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
    it('should get a review properly', () => {
      expect(resolver.reviewStore({ id: 1 })).resolves.toBe(exampleReviewStore);
    });
  });
  describe('reviewStore', () => {
    it('should get a review list properly', () => {
      expect(resolver.reviewsStore({})).resolves.toBe(examplesReviewStore);
    });
  });
  describe('avgReviewStore', () => {
    it('should get the reviews NPS Average', () => {
      expect(resolver.avgReviewStore()).resolves.toBe(9);
    });
  });
  describe('transitionReviewStoreToState', () => {
    it('should change state properly', () => {
      expect(
        resolver.transitionReviewStoreToState(adminCtx, {
          id: 1,
          state: 'Created'
        })
      ).resolves.toBe(exampleReviewStore);
    });
  });
});
