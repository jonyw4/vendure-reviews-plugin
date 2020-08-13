import * as Types from '../../src/types/generated-shop-schema';

export type ShopReviewStoreFragment = { __typename?: 'ReviewStore' } & Pick<
  Types.ReviewStore,
  'id' | 'title' | 'description' | 'nps'
>;

export type CreateReviewStoreMutationVariables = Types.Exact<{
  input: Types.CreateReviewStoreInput;
}>;

export type CreateReviewStoreMutation = { __typename?: 'Mutation' } & {
  createReviewStore?: Types.Maybe<
    { __typename?: 'ReviewStore' } & ShopReviewStoreFragment
  >;
};

export type UpdateReviewStoreMutationVariables = Types.Exact<{
  input: Types.UpdateReviewStoreInput;
}>;

export type UpdateReviewStoreMutation = { __typename?: 'Mutation' } & {
  updateReviewStore?: Types.Maybe<
    { __typename?: 'ReviewStore' } & ShopReviewStoreFragment
  >;
};

export type ListReviewStoreQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ListReviewStoreQuery = { __typename?: 'Query' } & {
  reviewsStore: { __typename?: 'ReviewStoreList' } & {
    items: Array<{ __typename?: 'ReviewStore' } & ShopReviewStoreFragment>;
  };
};

export type AvailableProductsReviewQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type AvailableProductsReviewQuery = { __typename?: 'Query' } & {
  availableProductsToReview: { __typename?: 'ProductList' } & {
    items: Array<
      { __typename?: 'Product' } & Pick<Types.Product, 'id' | 'name'>
    >;
  };
};

export type MyReviewStoreQueryVariables = Types.Exact<{ [key: string]: never }>;

export type MyReviewStoreQuery = { __typename?: 'Query' } & {
  myReviewStore?: Types.Maybe<
    { __typename?: 'ReviewStore' } & ShopReviewStoreFragment
  >;
};

export type AvgReviewStoreQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type AvgReviewStoreQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'avgReviewStore'
>;

export type ShopReviewProductFragment = { __typename?: 'ReviewProduct' } & Pick<
  Types.ReviewProduct,
  'id' | 'title' | 'description' | 'stars'
>;

export type CreateReviewProductMutationVariables = Types.Exact<{
  input: Types.CreateReviewProductInput;
}>;

export type CreateReviewProductMutation = { __typename?: 'Mutation' } & {
  createReviewProduct?: Types.Maybe<
    { __typename?: 'ReviewProduct' } & ShopReviewProductFragment
  >;
};

export type UpdateReviewProductMutationVariables = Types.Exact<{
  input: Types.UpdateReviewProductInput;
}>;

export type UpdateReviewProductMutation = { __typename?: 'Mutation' } & {
  updateReviewProduct?: Types.Maybe<
    { __typename?: 'ReviewProduct' } & ShopReviewProductFragment
  >;
};

export type ProductReviewQueryVariables = Types.Exact<{ [key: string]: never }>;

export type ProductReviewQuery = { __typename?: 'Query' } & {
  product?: Types.Maybe<
    { __typename?: 'Product' } & Pick<
      Types.Product,
      'id' | 'reviewAvg' | 'canReview'
    > & {
        reviews: { __typename?: 'ReviewProductList' } & {
          items: Array<
            { __typename?: 'ReviewProduct' } & ShopReviewProductFragment
          >;
        };
      }
  >;
};
