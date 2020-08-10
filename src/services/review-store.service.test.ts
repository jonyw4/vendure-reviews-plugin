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
  shopCtx
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
  });
  describe('ReviewStoreService', () => {
    describe('findCustomerReview', () => {
      it('should find the review', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => exampleCustomer
        );
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => exampleReviewStore);
        await expect(resolver.findCustomerReview(shopCtx)).resolves.toBe(
          exampleReviewStore
        );
      });
      it('should test a an undefined user and return an unauthorized error ', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => undefined
        );
        await expect(resolver.findCustomerReview(adminCtx)).rejects.toThrow(
          UnauthorizedError
        );
      });
      it('should test an empty user and  return an unauthorized error', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => undefined
        );
        await expect(resolver.findCustomerReview(shopCtx)).rejects.toThrow(
          UnauthorizedError
        );
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
      it('should return true', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => exampleCustomer
        );
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => undefined);
        connection.getRepository(Order).count.mockImplementation(async () => 1);
        await expect(
          resolver.checkIfCustomerIsValidToCreateReviewStore(shopCtx)
        ).resolves.toBe(true);
      });

      it('should test a an undefined user and return false', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => undefined
        );
        await expect(
          resolver.checkIfCustomerIsValidToCreateReviewStore(adminCtx)
        ).resolves.toBe(false);
      });
      it('should test an empty user and return false', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => undefined
        );
        await expect(
          resolver.checkIfCustomerIsValidToCreateReviewStore(shopCtx)
        ).resolves.toBe(false);
      });

      it('should test an customer with review and return false', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => exampleCustomer
        );
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => exampleReviewStore);
        await expect(
          resolver.checkIfCustomerIsValidToCreateReviewStore(shopCtx)
        ).resolves.toBe(false);
      });

      it('should test an customer without orders and return false', async () => {
        customerService.findOneByUserId.mockImplementation(
          async () => exampleCustomer
        );
        connection
          .getRepository(ReviewStoreEntity)
          .findOne.mockImplementation(async () => undefined);
        connection.getRepository(Order).count.mockImplementation(async () => 0);
        await expect(
          resolver.checkIfCustomerIsValidToCreateReviewStore(shopCtx)
        ).resolves.toBe(false);
      });
    });
  });
});
