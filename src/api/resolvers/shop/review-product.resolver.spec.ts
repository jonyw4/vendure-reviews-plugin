import { ReviewProductShopResolver } from './review-product.resolver';
import { TestingModule, Test } from '@nestjs/testing';
import { ReviewProductService } from '../../../services/review-product.service';
import { IllegalOperationError } from '@vendure/core';
import {
  shopCtx,
  exampleReviewProduct,
  examplesReviewProduct,
  exampleCustomer,
  exampleProduct
} from '../../../test-helpers';
import { createMock } from '@golevelup/nestjs-testing';

describe('ReviewProductShopResolver', () => {
  let resolver: ReviewProductShopResolver;

  const reviewProductService = createMock<ReviewProductService>({
    create: async () => exampleReviewProduct,
    findAll: async () => ({
      items: examplesReviewProduct,
      totalItems: 3
    })
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewProductShopResolver,
        {
          provide: ReviewProductService,
          useValue: reviewProductService
        }
      ]
    }).compile();
    resolver = module.get<ReviewProductShopResolver>(ReviewProductShopResolver);
  });

  it('should be defined', async () => {
    await expect(resolver).toBeDefined();
  });

  describe('createReviewProduct', () => {
    it('should create a review to product correctly', async () => {
      reviewProductService.getCustomerOrThrow.mockImplementation(
        async () => exampleCustomer
      );
      reviewProductService.getProductOrThrow.mockImplementation(
        async () => exampleProduct
      );
      reviewProductService.checkIfCustomerIsValidToCreateReviewProduct.mockImplementation(
        async () => true
      );
      await expect(
        resolver.createReviewProduct(shopCtx, { input: exampleReviewProduct })
      ).resolves.toBe(exampleReviewProduct);
    });
    it('should try to create a review of an invalid user', async () => {
      reviewProductService.getCustomerOrThrow.mockImplementation(
        async () => exampleCustomer
      );
      reviewProductService.getProductOrThrow.mockImplementation(
        async () => exampleProduct
      );
      reviewProductService.checkIfCustomerIsValidToCreateReviewProduct.mockImplementation(
        async () => false
      );
      await expect(
        resolver.createReviewProduct(shopCtx, { input: exampleReviewProduct })
      ).rejects.toThrow(IllegalOperationError);
    });
  });
  describe('updateReviewProduct', () => {
    it('should update a review product correctly', async () => {
      reviewProductService.getCustomerOrThrow.mockImplementation(
        async () => exampleCustomer
      );
      reviewProductService.findById.mockImplementation(
        async () => exampleReviewProduct
      );
      reviewProductService.update.mockImplementation(
        async () => examplesReviewProduct[1]
      );
      await expect(
        resolver.updateReviewProduct(shopCtx, {
          input: examplesReviewProduct[1]
        })
      ).resolves.toEqual(examplesReviewProduct[1]);
    });
  });
});
