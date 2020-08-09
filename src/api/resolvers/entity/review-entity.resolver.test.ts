import { exampleReviewStore } from './../../../test-helpers/entities';
import { ReviewStoreAdminEntityResolver } from './review-entity.resolver';
import { ReviewStoreService } from '../../../services/review-store.service';
import { TestingModule, Test } from '@nestjs/testing';
import { createMock } from '@golevelup/nestjs-testing';

describe('ReviewStoreAdminEntityResolver', () => {
  let resolver: ReviewStoreAdminEntityResolver;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewStoreAdminEntityResolver,
        {
          provide: ReviewStoreService,
          useValue: createMock<ReviewStoreService>({
            getNextReviewStates: () => ['Created']
          })
        }
      ]
    }).compile();
    resolver = module.get<ReviewStoreAdminEntityResolver>(
      ReviewStoreAdminEntityResolver
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('nextStates', () => {
    it('should get the next states', () => {
      expect(resolver.nextStates(exampleReviewStore)).resolves.toEqual([
        'Created'
      ]);
    });
  });
});
