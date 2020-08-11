import { createMock } from '@golevelup/nestjs-testing';
import { Connection } from 'typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import {
  ListQueryBuilder,
  CustomerService,
  EventBus,
  UnauthorizedError,
  Order
} from '@vendure/core';
import {
  examplesReviewStore,
  exampleReviewStore,
  exampleCustomer,
  adminCtx,
  shopCtx,
  failCtx
} from '../test-helpers';
import { ReviewStoreEntity } from '../entities/review-store.entity';
import { ReviewStoreService } from './review-store.service';

describe('ReviewStoreService', () => {
  let resolver: ReviewStoreService;

  const connection = createMock<Connection>();
  const listQueryBuilder = createMock<ListQueryBuilder>();
  const customerService = createMock<CustomerService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewStoreService,
        EventBus,
        { provide: ListQueryBuilder, useValue: listQueryBuilder },
        { provide: CustomerService, useValue: customerService },
        {
          provide: getConnectionToken(),
          useValue: connection
        }
      ]
    }).compile();
    resolver = module.get<ReviewStoreService>(ReviewStoreService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
  describe('Review Service', () => {
    describe('create', () => {
      it('should create a review store', async () => {
        connection
          .getRepository(ReviewStoreEntity)
          .save.mockImplementation(async () => exampleReviewStore);
        await expect(resolver.create(exampleReviewStore)).resolves.toEqual(
          exampleReviewStore
        );
      });
    });
    describe('findAll', () => {
      it('should find all a reviews stores', async () => {
        listQueryBuilder
          .build(ReviewStoreEntity, {})
          .getManyAndCount.mockImplementation(async () => [
            examplesReviewStore,
            3
          ]);

        await expect(resolver.findAll({})).resolves.toEqual({
          items: examplesReviewStore,
          totalItems: 3
        });
      });
    });
    describe('findById', () => {
      it('should create a review store', async () => {
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => exampleReviewStore);
        await expect(resolver.findById('1')).resolves.toBe(exampleReviewStore);
      });
    });
    describe('update', () => {
      it('should update the a review store', async () => {
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => exampleReviewStore);
        connection
          .getRepository(ReviewStoreEntity)
          .save.mockImplementation(async () => examplesReviewStore[1]);
        await expect(
          resolver.update(shopCtx, exampleReviewStore)
        ).resolves.toEqual(exampleReviewStore);
      });
    });
    describe('transitionToState', () => {
      it('should transition', async () => {
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => exampleReviewStore);
        connection
          .getRepository(ReviewStoreEntity)
          .save.mockImplementation(async () => true);
        await expect(
          resolver.transitionToState(adminCtx, exampleReviewStore, 'Authorized')
        ).resolves.toEqual(exampleReviewStore);
      });
    });
    describe('getNextReviewStates', () => {
      it('should get the next states from review', async () => {
        await expect(resolver.getNextReviewStates(exampleReviewStore)).toEqual([
          'Updated',
          'Denied'
        ]);
      });
    });
    describe('getCustomer', () => {
      it('should try to get an customer by the ctx and succeeds', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => exampleCustomer
        );
        await expect(resolver.getCustomer(shopCtx)).resolves.toEqual(
          exampleCustomer
        );
      });
      it('should try to get an customer by the ctx and fail', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => undefined
        );
        await expect(resolver.getCustomer(shopCtx)).resolves.toEqual(undefined);
      });
      it('should try to get an customer by an unauthorized ctx and fail', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => undefined
        );
        await expect(resolver.getCustomer(failCtx)).resolves.toEqual(undefined);
      });
    });
    describe('getCustomerOrThrow', () => {
      it('should try to get an customer by the ctx and succeeds', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => exampleCustomer
        );
        await expect(resolver.getCustomerOrThrow(shopCtx)).resolves.toEqual(
          exampleCustomer
        );
      });
      it('should try to get an customer by the ctx and fail', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => undefined
        );
        await expect(resolver.getCustomerOrThrow(shopCtx)).rejects.toThrow(
          UnauthorizedError
        );
      });
    });
  });
  describe('ReviewStoreService', () => {
    describe('findCustomerReview', () => {
      it('should find the review', async () => {
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => exampleReviewStore);
        await expect(
          resolver.findCustomerReview(exampleCustomer)
        ).resolves.toBe(exampleReviewStore);
      });
    });
    describe('getNPSAvg', () => {
      it('should return the average', async () => {
        connection
          .getRepository(ReviewStoreEntity)
          .createQueryBuilder('review_store')
          .select('AVG(nps)', 'nps')
          .where('state = :state', { state: 'Authorized' })
          .getRawOne.mockImplementation(async () => ({ nps: 10 }));
        await expect(resolver.getNPSAvg()).resolves.toBe(10);
      });
    });
    describe('checkIfCustomerIsValidToCreateReviewStore', () => {
      it('should test an customer with a review and return false', async () => {
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => exampleReviewStore);
        await expect(
          resolver.checkIfCustomerIsValidToCreateReviewStore(exampleCustomer)
        ).resolves.toBe(false);
      });
      it('should test an customer without review and orders and return false', async () => {
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => undefined);
        connection.getRepository(Order).count.mockImplementation(async () => 0);
        await expect(
          resolver.checkIfCustomerIsValidToCreateReviewStore(exampleCustomer)
        ).resolves.toBe(false);
      });
      it('should test an customer without review and with valid order and return true', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => exampleCustomer
        );
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => undefined);
        connection.getRepository(Order).count.mockImplementation(async () => 1);
        await expect(
          resolver.checkIfCustomerIsValidToCreateReviewStore(exampleCustomer)
        ).resolves.toBe(true);
      });
    });
  });
});
