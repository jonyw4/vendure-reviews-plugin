import { ReviewProductShopProductResolver } from './review-product-shop-product.resolver';
import { TestingModule, Test } from '@nestjs/testing';
import { ReviewProductService } from '../../../services/review-product.service';
import { examplesReviewProduct, exampleProduct } from '../../../test-helpers';
import { createMock } from '@golevelup/nestjs-testing';

describe('ReviewProductShopProductResolver', () => {
  let resolver: ReviewProductShopProductResolver;

  const reviewProductService = createMock<ReviewProductService>({
    getAvgStars: async () => 4,
    findAll: async () => ({ items: examplesReviewProduct, totalItems: 3 })
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewProductShopProductResolver,
        {
          provide: ReviewProductService,
          useValue: reviewProductService
        }
      ]
    }).compile();
    resolver = module.get<ReviewProductShopProductResolver>(
      ReviewProductShopProductResolver
    );
  });

  it('should be defined', async () => {
    await expect(resolver).toBeDefined();
  });

  describe('avgReviewProduct', () => {
    it('should get the stars Average', async () => {
      await expect(resolver.reviewAvg()).resolves.toBe(4);
    });
  });
  describe('reviews', () => {
    it('should get the reviews of the product', async () => {
      await expect(resolver.reviews({}, exampleProduct)).resolves.toEqual({
        items: examplesReviewProduct,
        totalItems: 3
      });
    });
  });
});
