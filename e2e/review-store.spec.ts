import path from 'path';
import initialData from './config/initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from './config/config';
import {
  createTestEnvironment,
  registerInitializer,
  SqljsInitializer
} from '@vendure/testing';
import { SHOP_CREATE_REVIEW_STORE } from './graphql/shop-api.graphql';
import {
  CreateReviewStoreMutation,
  CreateReviewStoreMutationVariables
} from './graphql/shop-api.graphql.types';

registerInitializer(
  'sqljs',
  new SqljsInitializer(path.join(__dirname, '__data__'))
);

describe('Review Store E2E', () => {
  const { server, shopClient } = createTestEnvironment(testConfig);

  beforeAll(async () => {
    await server.init({
      initialData,
      productsCsvPath: path.join(__dirname, 'config/products.csv'),
      customerCount: 2
    });
  }, TEST_SETUP_TIMEOUT_MS);

  afterAll(async () => {
    await server.destroy();
  });

  it('should try to create a review with an customer without permission and throw error', async () => {
    expect(
      shopClient.query<
        CreateReviewStoreMutation,
        CreateReviewStoreMutationVariables
      >(SHOP_CREATE_REVIEW_STORE, {
        input: {
          title: 'Good company',
          description: 'Good company',
          nps: 10
        }
      })
    ).rejects.toThrow('cannot-create-review-store');
  });
  // TODO: SHOP: Create an review with an customer with order
  // TODO: SHOP: Get my review store
  // TODO: ADMIN: Get reviews store list
  // TODO: ADMIN: Get a reviews store
  // TODO: ADMIN: transitionReviewStoreToState -> APPROVED
  // TODO: ADMIN: Get the average of review store
  // TODO: SHOP: Get the average of review store
});
