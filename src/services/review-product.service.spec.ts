import { shopCtx } from './../test-helpers/contexts';
import {
  exampleProduct,
  exampleCustomer,
  examplesReviewProduct
} from './../test-helpers/entities';
import { createMock } from '@golevelup/nestjs-testing';
import { Connection } from 'typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import {
  ListQueryBuilder,
  CustomerService,
  EventBus,
  Product,
  OrderLine
} from '@vendure/core';
import { ReviewProductEntity } from '../entities/review-product.entity';
import { ReviewProductService } from './review-product.service';

describe('ReviewProductService', () => {
  let resolver: ReviewProductService;

  const connection = createMock<Connection>();
  const listQueryBuilder = createMock<ListQueryBuilder>();
  const customerService = createMock<CustomerService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewProductService,
        EventBus,
        { provide: ListQueryBuilder, useValue: listQueryBuilder },
        { provide: CustomerService, useValue: customerService },
        {
          provide: getConnectionToken(),
          useValue: connection
        }
      ]
    }).compile();
    resolver = module.get<ReviewProductService>(ReviewProductService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
  describe('getAvgStars', () => {
    it('should return the average', async () => {
      connection
        .getRepository(ReviewProductEntity)
        .createQueryBuilder('review_product')
        .select('AVG(stars)', 'starasync s')
        .where('state = :state', { state: 'Authorized' })
        .getRawOne.mockImplementation(async () => ({ stars: 5 }));
      await expect(resolver.getAvgStars()).resolves.toBe(5);
    });
  });
  describe('getProductOrThrow', () => {
    it('should get product by id', async () => {
      connection
        .getRepository(Product)
        .findOneOrFail.mockImplementation(async () => exampleProduct);
      await expect(resolver.getProductOrThrow('1')).resolves.toBe(
        exampleProduct
      );
    });
  });
  describe('checkIfCustomerIsValidToCreateReviewProduct', () => {
    it('should try to check if customer is valid to create review product and succeeds', async () => {
      connection
        .getRepository(ReviewProductEntity)
        .count.mockImplementationOnce(async () => 0);
      connection
        .getRepository(OrderLine)
        .count.mockImplementationOnce(async () => 1);
      await expect(
        resolver.checkIfCustomerIsValidToCreateReviewProduct(
          exampleCustomer,
          exampleProduct
        )
      ).resolves.toBe(true);
    });

    it('should try to check if customer is valid to create review product in a product that he already reviewed and fail', async () => {
      connection
        .getRepository(Product)
        .findOneOrFail.mockImplementation(async () => exampleProduct);
      connection
        .getRepository(ReviewProductEntity)
        .count.mockImplementationOnce(async () => 1);
      await expect(
        resolver.checkIfCustomerIsValidToCreateReviewProduct(
          exampleCustomer,
          exampleProduct
        )
      ).resolves.toBe(false);
    });

    it("should try to check if customer is valid to create review product in a product that he didn't bought and fail", async () => {
      connection
        .getRepository(Product)
        .findOneOrFail.mockImplementation(async () => exampleProduct);
      connection
        .getRepository(ReviewProductEntity)
        .count.mockImplementationOnce(async () => 0);
      connection
        .getRepository(OrderLine)
        .count.mockImplementationOnce(async () => 0);
      await expect(
        resolver.checkIfCustomerIsValidToCreateReviewProduct(
          exampleCustomer,
          exampleProduct
        )
      ).resolves.toBe(false);
    });
  });

  describe('availableProductsToReview', () => {
    it('should get available products to review', async () => {
      connection
        .getRepository(ReviewProductEntity)
        .find.mockImplementationOnce(async () => []);
      listQueryBuilder
        .build(OrderLine, {}, {})
        .select('productVariant')
        .distinct(true)
        .getMany.mockImplementationOnce(async () => [
          new OrderLine({ productVariant: { productId: '1' } }),
          new OrderLine({ productVariant: { productId: '2' } })
        ]);
      listQueryBuilder
        .build(Product, {}, {})
        .getManyAndCount.mockImplementationOnce(async () => [
          examplesReviewProduct,
          3
        ]);
      await expect(
        resolver.availableProductsToReview(shopCtx, exampleCustomer, {})
      ).resolves.toEqual({ items: examplesReviewProduct, totalItems: 3 });
    });
  });
});
