import { ReviewStoreShopResolver } from './review-store.resolver';
import { TestingModule, Test } from '@nestjs/testing';
import { ReviewStoreService } from '../../../services/review-store.service';
import { IllegalOperationError } from '@vendure/core';
import {
  shopCtx,
  exampleReviewStore,
  examplesReviewStore
} from '../../../test-helpers';
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

  it('should be defined', async () => {
    await expect(resolver).toBeDefined();
  });

  describe('getNPSAvg', () => {
    it('should get the NPS Average', async () => {
      await expect(resolver.avgReviewStore()).resolves.toBe(9);
    });
  });

  describe('myReviewStore', () => {
    it('should return my review for store', async () => {
      await expect(resolver.myReviewStore(shopCtx)).resolves.toBe(
        exampleReviewStore
      );
    });
  });

  describe('createReviewStore', () => {
    it('should create a review to store correctly', async () => {
      reviewStoreService.checkIfCustomerIsValidToCreateReviewStore.mockImplementation(
        async () => true
      );
      await expect(
        resolver.createReviewStore(shopCtx, { input: exampleReviewStore })
      ).resolves.toBe(exampleReviewStore);
    });
    it('should reject to create a review to store', async () => {
      reviewStoreService.checkIfCustomerIsValidToCreateReviewStore.mockImplementation(
        async () => false
      );
      await expect(
        resolver.createReviewStore(shopCtx, { input: exampleReviewStore })
      ).rejects.toThrow(IllegalOperationError);
    });
  });
  describe('updateReviewStore', () => {
    it('should update a review store correctly', async () => {
      reviewStoreService.findCustomerReview.mockImplementation(
        async () => exampleReviewStore
      );
      reviewStoreService.update.mockImplementation(
        async () => examplesReviewStore[1]
      );
      await expect(
        resolver.updateReviewStore(shopCtx, { input: examplesReviewStore[1] })
      ).resolves.toEqual(examplesReviewStore[1]);
    });
    it('should try to update a undefined customer review store and fail', async () => {
      reviewStoreService.findCustomerReview.mockImplementation(
        async () => undefined
      );
      await expect(
        resolver.updateReviewStore(shopCtx, { input: exampleReviewStore })
      ).rejects.toThrow(IllegalOperationError);
    });
  });
});
