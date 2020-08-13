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
  ADMIN_REVIEWS_PRODUCT,
  ADMIN_REVIEW_PRODUCT,
  ADMIN_TRANSITION_REVIEW_PRODUCT
} from './graphql/admin-api.graphql';
import {
  SHOP_CREATE_REVIEW_PRODUCT,
  SHOP_UPDATE_REVIEW_PRODUCT,
  SHOP_PRODUCT_REVIEW,
  SHOP_AVAILABLE_PRODUCTS_REVIEW,
  SHOP_REVIEW_PRODUCT,
  SHOP_REVIEWS_PRODUCT
} from './graphql/shop-api.graphql';
import {
  ReviewProductQuery,
  ReviewProductQueryVariables,
  ListReviewProductQuery,
  ListReviewProductQueryVariables,
  CustomerListQuery,
  CustomerListQueryVariables,
  TransitionReviewProductToStateMutation,
  TransitionReviewProductToStateMutationVariables
} from './graphql/admin-api.graphql.types';
import {
  ProductReviewQuery,
  ProductReviewQueryVariables,
  CreateReviewProductMutation,
  CreateReviewProductMutationVariables,
  UpdateReviewProductMutation,
  UpdateReviewProductMutationVariables,
  AvailableProductsReviewQuery,
  AvailableProductsReviewQueryVariables
} from './graphql/shop-api.graphql.types';

registerInitializer(
  'sqljs',
  new SqljsInitializer(path.join(__dirname, '__data__'))
);

const customerTestPassword = 'test';

const exampleCreteReviewProduct = {
  title: 'Good company',
  description: 'Good company',
  stars: 5
};

describe('Review Product E2E', () => {
  const { server, shopClient, adminClient } = createTestEnvironment(testConfig);

  let customers: CustomerListQuery['customers']['items'];
  beforeAll(async () => {
    await server.init({
      initialData,
      productsCsvPath: path.join(__dirname, 'config/products.csv'),
      customerCount: 2
    });

    await adminClient.asSuperAdmin();

    const result = await adminClient.query<
      CustomerListQuery,
      CustomerListQueryVariables
    >(ADMIN_CUSTOMER_LIST);
    customers = result.customers.items;
  }, TEST_SETUP_TIMEOUT_MS);

  afterAll(async () => {
    await server.destroy();
  });

  it('should try to create a review with an customer without bought the product and throw error', async () => {
    await shopClient.asUserWithCredentials(
      customers[0].emailAddress,
      customerTestPassword
    );

    await expect(
      shopClient.query<
        CreateReviewProductMutation,
        CreateReviewProductMutationVariables
      >(SHOP_CREATE_REVIEW_PRODUCT, {
        input: {
          productId: '1',
          ...exampleCreteReviewProduct
        }
      })
    ).rejects.toThrow('cannot-create-review-product');
  });

  it('should try to get a list of available products to review with an valid customer and succeeds', async () => {
    await shopClient.asUserWithCredentials(
      customers[1].emailAddress,
      customerTestPassword
    );

    await expect(
      shopClient.query<
        AvailableProductsReviewQuery,
        AvailableProductsReviewQueryVariables
      >(SHOP_AVAILABLE_PRODUCTS_REVIEW)
    ).resolves.toEqual({
      availableProductsToReview: {
        items: [
          {
            id: 'T_1',
            name: 'Laptop'
          }
        ]
      }
    });
  });

  it('should try to create a review with an valid customer and succeeds', async () => {
    await shopClient.asUserWithCredentials(
      customers[1].emailAddress,
      customerTestPassword
    );

    await expect(
      shopClient.query<
        CreateReviewProductMutation,
        CreateReviewProductMutationVariables
      >(SHOP_CREATE_REVIEW_PRODUCT, {
        input: {
          productId: '1',
          ...exampleCreteReviewProduct
        }
      })
    ).resolves.toEqual({
      createReviewProduct: {
        id: 'T_1',
        ...exampleCreteReviewProduct
      }
    });
  });

  it('should try to get a list of available products to review with an valid customer and returns null', async () => {
    await shopClient.asUserWithCredentials(
      customers[1].emailAddress,
      customerTestPassword
    );

    await expect(
      shopClient.query<
        AvailableProductsReviewQuery,
        AvailableProductsReviewQueryVariables
      >(SHOP_AVAILABLE_PRODUCTS_REVIEW)
    ).resolves.toEqual({
      availableProductsToReview: {
        items: []
      }
    });
  });

  it('should try to create a review with an customer that already have a review of an product and throw error', async () => {
    await expect(
      shopClient.query<
        CreateReviewProductMutation,
        CreateReviewProductMutationVariables
      >(SHOP_CREATE_REVIEW_PRODUCT, {
        input: {
          productId: '1',
          ...exampleCreteReviewProduct
        }
      })
    ).rejects.toThrow('cannot-create-review-product');
  });

  it('should try to get the list of reviews of the current user', async () => {
    await expect(
      shopClient.query<ListReviewProductQuery, ListReviewProductQueryVariables>(
        SHOP_REVIEWS_PRODUCT
      )
    ).resolves.toEqual({
      reviewsProduct: {
        items: [
          {
            id: 'T_1',
            ...exampleCreteReviewProduct
          }
        ]
      }
    });
  });

  it('should try to get the a reviews of the current user', async () => {
    await expect(
      shopClient.query<any, any>(SHOP_REVIEW_PRODUCT, { id: 'T_1' })
    ).resolves.toEqual({});
  });

  it('should get the list of reviews product in admin', async () => {
    await adminClient.asSuperAdmin();
    await expect(
      adminClient.query<
        ListReviewProductQuery,
        ListReviewProductQueryVariables
      >(ADMIN_REVIEWS_PRODUCT)
    ).resolves.toEqual({
      reviewsProduct: {
        items: [
          {
            id: 'T_1',
            nextStates: ['Authorized', 'Denied', 'Updated'],
            state: 'Created',
            customer: {
              id: 'T_2',
              firstName: 'Trevor'
            },
            ...exampleCreteReviewProduct
          }
        ]
      }
    });
  });

  it('should get the a review product in admin', async () => {
    await expect(
      adminClient.query<ReviewProductQuery, ReviewProductQueryVariables>(
        ADMIN_REVIEW_PRODUCT,
        {
          id: 'T_1'
        }
      )
    ).resolves.toEqual({
      reviewProduct: {
        id: 'T_1',
        nextStates: ['Authorized', 'Denied', 'Updated'],
        state: 'Created',
        customer: {
          id: 'T_2',
          firstName: 'Trevor'
        },
        ...exampleCreteReviewProduct
      }
    });
  });

  it('should transit a review product to Authorized', async () => {
    await expect(
      adminClient.query<
        TransitionReviewProductToStateMutation,
        TransitionReviewProductToStateMutationVariables
      >(ADMIN_TRANSITION_REVIEW_PRODUCT, {
        id: 'T_1',
        state: 'Authorized'
      })
    ).resolves.toEqual({
      transitionReviewProductToState: {
        id: 'T_1',
        state: 'Authorized',
        nextStates: ['Updated', 'Denied'],
        customer: {
          id: 'T_2',
          firstName: 'Trevor'
        },
        ...exampleCreteReviewProduct
      }
    });
  });

  it('should get the the list of reviews of an product in shop', async () => {
    await expect(
      shopClient.query<ProductReviewQuery, ProductReviewQueryVariables>(
        SHOP_PRODUCT_REVIEW
      )
    ).resolves.toEqual({
      product: {
        reviews: {
          items: [
            {
              id: 'T_1',
              ...exampleCreteReviewProduct
            }
          ]
        }
      }
    });
  });

  it('should try to update a review with an customer and succeeds', async () => {
    await shopClient.asUserWithCredentials(
      customers[1].emailAddress,
      customerTestPassword
    );

    await expect(
      shopClient.query<
        UpdateReviewProductMutation,
        UpdateReviewProductMutationVariables
      >(SHOP_UPDATE_REVIEW_PRODUCT, {
        input: {
          id: 'T_1',
          ...exampleCreteReviewProduct
        }
      })
    ).resolves.toEqual({
      updateReviewProduct: {
        id: 'T_1',
        ...exampleCreteReviewProduct
      }
    });
  });

  it('should get the the review product in admin and should be Updated', async () => {
    await expect(
      adminClient.query<ReviewProductQuery, ReviewProductQueryVariables>(
        ADMIN_REVIEW_PRODUCT,
        {
          id: 'T_1'
        }
      )
    ).resolves.toEqual({
      reviewProduct: {
        id: 'T_1',
        customer: {
          id: 'T_2',
          firstName: 'Trevor'
        },
        nextStates: ['Authorized', 'Denied'],
        state: 'Updated',
        ...exampleCreteReviewProduct
      }
    });
  });
});
