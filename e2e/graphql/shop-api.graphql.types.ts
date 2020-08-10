import * as Types from '../../src/types/generated-shop-schema';

export type ReviewStoreTestFragment = { __typename?: 'ReviewStore' } & Pick<
  Types.ReviewStore,
  'id' | 'title' | 'description'
>;

export type CreateReviewStoreMutationVariables = Types.Exact<{
  input: Types.CreateReviewStoreInput;
}>;

export type CreateReviewStoreMutation = { __typename?: 'Mutation' } & {
  createReviewStore?: Types.Maybe<
    { __typename?: 'ReviewStore' } & ReviewStoreTestFragment
  >;
};
