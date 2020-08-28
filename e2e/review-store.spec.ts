import path from 'path';
import initialData from './config/initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from './config/config';
import {
  createTestEnvironment,
  registerInitializer,
  SqljsInitializer
} from '@vendure/testing';
import {
  ADMIN_CUSTOMER_LIST,
  ADMIN_REVIEWS_STORE,
  ADMIN_REVIEW_STORE,
  ADMIN_TRANSITION_REVIEW_STORE,
  ADMIN_AVG_REVIEW_STORE
} from './graphql/admin-api.graphql';
import {
  SHOP_CREATE_REVIEW_STORE,
  SHOP_MY_REVIEW_STORE,
  SHOP_AVG_REVIEW_STORE,
  SHOP_UPDATE_REVIEW_STORE,
  SHOP_REVIEWS_STORE
} from './graphql/shop-api.graphql';
import {
  ReviewStoreQuery,
  ReviewStoreQueryVariables,
  ListReviewStoreQuery,
  ListReviewStoreQueryVariables,
  CustomerListQuery,
  CustomerListQueryVariables,
  TransitionReviewStoreToStateMutation,
  TransitionReviewStoreToStateMutationVariables
} from './graphql/admin-api.graphql.types';
import {
  MyReviewStoreQueryVariables,
  CreateReviewStoreMutation,
  CreateReviewStoreMutationVariables,
  MyReviewStoreQuery,
  AvgReviewStoreQuery,
  AvgReviewStoreQueryVariables,
  UpdateReviewStoreMutation,
  UpdateReviewStoreMutationVariables,
  ListReviewStoreQueryVariables as ShopListReviewStoreQueryVariables,
  ListReviewStoreQuery as ShopListReviewStoreQuery
} from './graphql/shop-api.graphql.types';

registerInitializer(
  'sqljs',
  new SqljsInitializer(path.join(__dirname, '__data__'))
);

const customerTestPassword = 'test';

const exampleCreteReviewStore = {
  title: 'Good company',
  description: 'Good company',
  nps: 10,
  customerNameIsPublic: false
};

describe('Review Store E2E', () => {
  const { server, shopClient, adminClient } = createTestEnvironment(testConfig);

  let customers: CustomerListQuery['customers']['items'];
  beforeAll(async () => {
    await server.init({
      initialData,
      productsCsvPath: path.join(__dirname, 'config/products.csv'),
      customerCount: 2
    });

    await adminClient.asSuperAdmin();

    // Query the customers created by test environment
    const result = await adminClient.query<
      CustomerListQuery,
      CustomerListQueryVariables
    >(ADMIN_CUSTOMER_LIST);
    customers = result.customers.items;
  }, TEST_SETUP_TIMEOUT_MS);

  afterAll(async () => {
    await server.destroy();
  });

  it('should try to create a review with an customer without approved order and throw error', async () => {
    await shopClient.asUserWithCredentials(
      customers[0].emailAddress,
      customerTestPassword
    );

    await expect(
      shopClient.query<
        CreateReviewStoreMutation,
        CreateReviewStoreMutationVariables
      >(SHOP_CREATE_REVIEW_STORE, {
        input: {
          ...exampleCreteReviewStore
        }
      })
    ).rejects.toThrow('cannot-create-review-store');
  });

  it('should try to create a review with an valid customer and succeeds', async () => {
    await shopClient.asUserWithCredentials(
      customers[1].emailAddress,
      customerTestPassword
    );

    await expect(
      shopClient.query<
        CreateReviewStoreMutation,
        CreateReviewStoreMutationVariables
      >(SHOP_CREATE_REVIEW_STORE, {
        input: {
          ...exampleCreteReviewStore
        }
      })
    ).resolves.toEqual({
      createReviewStore: {
        id: 'T_1',
        ...exampleCreteReviewStore,
        customerName: null
      }
    });
  });

  it('should try to create a review with an customer that already have a review and throw error', async () => {
    await expect(
      shopClient.query<
        CreateReviewStoreMutation,
        CreateReviewStoreMutationVariables
      >(SHOP_CREATE_REVIEW_STORE, {
        input: {
          ...exampleCreteReviewStore
        }
      })
    ).rejects.toThrow('cannot-create-review-store');
  });

  it('should try to get the review of the current customer', async () => {
    await expect(
      shopClient.query<MyReviewStoreQuery, MyReviewStoreQueryVariables>(
        SHOP_MY_REVIEW_STORE
      )
    ).resolves.toEqual({
      myReviewStore: {
        id: 'T_1',
        customerName: null,
        ...exampleCreteReviewStore
      }
    });
  });

  it('should try to get the current review store avg in shop and returns 0', async () => {
    await expect(
      shopClient.query<AvgReviewStoreQuery, AvgReviewStoreQueryVariables>(
        SHOP_AVG_REVIEW_STORE
      )
    ).resolves.toEqual({
      avgReviewStore: 0
    });
  });

  it('should get the list of reviews store in admin', async () => {
    await adminClient.asSuperAdmin();
    await expect(
      adminClient.query<ListReviewStoreQuery, ListReviewStoreQueryVariables>(
        ADMIN_REVIEWS_STORE
      )
    ).resolves.toEqual({
      reviewsStore: {
        items: [
          {
            id: 'T_1',
            nextStates: ['Authorized', 'Denied', 'Updated'],
            state: 'Created',
            customer: {
              id: 'T_2',
              firstName: 'Trevor'
            },
            ...exampleCreteReviewStore
          }
        ]
      }
    });
  });

  it('should get the a review store in admin', async () => {
    await expect(
      adminClient.query<ReviewStoreQuery, ReviewStoreQueryVariables>(
        ADMIN_REVIEW_STORE,
        {
          id: 'T_1'
        }
      )
    ).resolves.toEqual({
      reviewStore: {
        id: 'T_1',
        nextStates: ['Authorized', 'Denied', 'Updated'],
        state: 'Created',
        customer: {
          id: 'T_2',
          firstName: 'Trevor'
        },
        ...exampleCreteReviewStore
      }
    });
  });

  it('should transit a review store to Authorized', async () => {
    await expect(
      adminClient.query<
        TransitionReviewStoreToStateMutation,
        TransitionReviewStoreToStateMutationVariables
      >(ADMIN_TRANSITION_REVIEW_STORE, {
        id: 'T_1',
        state: 'Authorized'
      })
    ).resolves.toEqual({
      transitionReviewStoreToState: {
        id: 'T_1',
        state: 'Authorized',
        nextStates: ['Updated', 'Denied'],
        customer: {
          id: 'T_2',
          firstName: 'Trevor'
        },
        ...exampleCreteReviewStore
      }
    });
  });

  it('should get the the list of review store in shop', async () => {
    await expect(
      shopClient.query<
        ShopListReviewStoreQuery,
        ShopListReviewStoreQueryVariables
      >(SHOP_REVIEWS_STORE)
    ).resolves.toEqual({
      reviewsStore: {
        items: [
          {
            id: 'T_1',
            customerName: null,
            ...exampleCreteReviewStore
          }
        ]
      }
    });
  });

  it('should try to get the current review store avg in admin and returns 10', async () => {
    await expect(
      adminClient.query<AvgReviewStoreQuery, AvgReviewStoreQueryVariables>(
        ADMIN_AVG_REVIEW_STORE
      )
    ).resolves.toEqual({
      avgReviewStore: 10
    });
  });

  it('should try to get the current review store avg in shop and returns 10', async () => {
    await expect(
      shopClient.query<AvgReviewStoreQuery, AvgReviewStoreQueryVariables>(
        SHOP_AVG_REVIEW_STORE
      )
    ).resolves.toEqual({
      avgReviewStore: 10
    });
  });

  it('should try to update a review with an customer and succeeds', async () => {
    await shopClient.asUserWithCredentials(
      customers[1].emailAddress,
      customerTestPassword
    );

    await expect(
      shopClient.query<
        UpdateReviewStoreMutation,
        UpdateReviewStoreMutationVariables
      >(SHOP_UPDATE_REVIEW_STORE, {
        input: {
          ...exampleCreteReviewStore,
          customerNameIsPublic: true
        }
      })
    ).resolves.toEqual({
      updateReviewStore: {
        id: 'T_1',
        ...exampleCreteReviewStore,
        customerNameIsPublic: true,
        customerName: 'Trevor'
      }
    });
  });

  it('should get the the review store in admin and should be Updated', async () => {
    await expect(
      adminClient.query<ReviewStoreQuery, ReviewStoreQueryVariables>(
        ADMIN_REVIEW_STORE,
        {
          id: 'T_1'
        }
      )
    ).resolves.toEqual({
      reviewStore: {
        id: 'T_1',
        customer: {
          id: 'T_2',
          firstName: 'Trevor'
        },
        nextStates: ['Authorized', 'Denied'],
        state: 'Updated',
        ...exampleCreteReviewStore,
        customerNameIsPublic: true
      }
    });
  });
});
