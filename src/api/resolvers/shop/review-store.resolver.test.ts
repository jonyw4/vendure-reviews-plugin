import { ReviewStoreShopResolver } from './review-store.resolver';
import { TestingModule, Test } from '@nestjs/testing';
import { ReviewStoreService } from '../../../services/review-store.service';
import { IllegalOperationError } from '@vendure/core';
import { shopCtx, exampleReviewStore } from '../../../test-helpers';

describe('ReviewStoreShopResolver', () => {
  let resolver: ReviewStoreShopResolver;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewStoreShopResolver,
        {
          provide: ReviewStoreService,
          useFactory: () => ({
            getNPSAvg: jest.fn(() => 9),
            findCustomerReview: jest.fn(() => exampleReviewStore),
            checkIfCustomerIsValidToCreateReviewStore: jest
              .fn()
              .mockReturnValue(true)
              .mockReturnValueOnce(true)
              .mockReturnValueOnce(false),
            create: jest.fn(() => exampleReviewStore)
          })
        }
      ]
    }).compile();
    resolver = module.get<ReviewStoreShopResolver>(ReviewStoreShopResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getNPSAvg', () => {
    it('should get the NPS Average', () => {
      expect(resolver.avgReviewStore()).resolves.toBe(9);
    });
  });

  describe('myReviewStore', () => {
    it('should return my review for store', () => {
      expect(resolver.myReviewStore(shopCtx)).resolves.toBe(exampleReviewStore);
    });
  });

  describe('createReviewStore', () => {
    it('should create a review to store correctly', () => {
      expect(
        resolver.createReviewStore(shopCtx, exampleReviewStore)
      ).resolves.toBe(exampleReviewStore);
    });
    it('should reject to create a review to store', () => {
      expect(
        resolver.createReviewStore(shopCtx, exampleReviewStore)
      ).rejects.toThrow(IllegalOperationError);
    });
  });
});
