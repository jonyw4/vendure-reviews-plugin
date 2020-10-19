import { ReviewProductAdminResolver } from './review-product.resolver';
import { TestingModule, Test } from '@nestjs/testing';
import { ReviewProductService } from '../../../services/review-product.service';
import {
  exampleReviewProduct,
  examplesReviewProduct,
  adminCtx,
  shopCtx,
  exampleProduct
} from '../../../test-helpers';
import { createMock } from '@golevelup/nestjs-testing';
import { ProductService } from '@vendure/core';

describe('ReviewProductAdminResolver', () => {
  let resolver: ReviewProductAdminResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewProductAdminResolver,
        {
          provide: ReviewProductService,
          useValue: createMock<ReviewProductService>({
            findById: async () => exampleReviewProduct,
            findAll: async () => ({
              items: examplesReviewProduct,
              totalItems: 3
            }),
            transitionToState: async () => exampleReviewProduct,
            getNextReviewStates: () => ['Created']
          })
        },
        {
          provide: ProductService,
          useValue: createMock<ProductService>({
            // @ts-ignore
            findOne: async () => exampleProduct
          })
        }
      ]
    }).compile();
    resolver = module.get<ReviewProductAdminResolver>(
      ReviewProductAdminResolver
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('reviewProduct', () => {
    it('should get a review properly', async () => {
      await expect(resolver.reviewProduct(shopCtx, { id: '1' })).resolves.toBe(
        exampleReviewProduct
      );
    });
  });
  describe('reviewsProduct', () => {
    it('should get a review list properly', async () => {
      await expect(resolver.reviewsProduct({})).resolves.toEqual({
        items: examplesReviewProduct,
        totalItems: 3
      });
    });
  });
  describe('transitionReviewProductToState', () => {
    it('should change state properly', async () => {
      await expect(
        resolver.transitionReviewProductToState(adminCtx, {
          id: '1',
          state: 'Created'
        })
      ).resolves.toBe(exampleReviewProduct);
    });
  });
  describe('nextStates', () => {
    it('should get the next states', async () => {
      await expect(resolver.nextStates(exampleReviewProduct)).resolves.toEqual([
        'Created'
      ]);
    });
  });

  describe('product', () => {
    it('should get the product', async () => {
      await expect(
        resolver.product(shopCtx, exampleReviewProduct)
      ).resolves.toEqual(exampleProduct);
    });
  });
});
