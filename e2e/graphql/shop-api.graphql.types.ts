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
