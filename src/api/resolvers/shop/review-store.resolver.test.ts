import { ReviewStoreShopResolver } from './review-store.resolver';
import { TestingModule, Test } from '@nestjs/testing';
import { ReviewStoreService } from '../../../services/review-store.service';
import { IllegalOperationError } from '@vendure/core';
import { shopCtx, exampleReviewStore } from '../../../test-helpers';
import { createMock } from '@golevelup/nestjs-testing';

describe('ReviewStoreShopResolver', () => {
  let resolver: ReviewStoreShopResolver;

  const reviewStoreService = createMock<ReviewStoreService>({
    getNPSAvg: async () => 9,
    findCustomerReview: async () => exampleReviewStore,
    create: async () => exampleReviewStore
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewStoreShopResolver,
        {
          provide: ReviewStoreService,
          useValue: reviewStoreService
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
      reviewStoreService.checkIfCustomerIsValidToCreateReviewStore.mockImplementation(
        async () => true
      );
      expect(
        resolver.createReviewStore(shopCtx, exampleReviewStore)
      ).resolves.toBe(exampleReviewStore);
    });
    it('should reject to create a review to store', () => {
      reviewStoreService.checkIfCustomerIsValidToCreateReviewStore.mockImplementation(
        async () => false
      );
      expect(
        resolver.createReviewStore(shopCtx, exampleReviewStore)
      ).rejects.toThrow(IllegalOperationError);
    });
  });
});
