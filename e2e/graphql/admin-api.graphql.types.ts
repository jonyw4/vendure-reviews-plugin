import * as Types from '../../src/types/generated-admin-schema';

export type ReviewStoreTestFragment = { __typename?: 'ReviewStore' } & Pick<
  Types.ReviewStore,
  'id' | 'title' | 'description' | 'state' | 'nps' | 'nextStates'
>;

export type ReviewStoreQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type ReviewStoreQuery = { __typename?: 'Query' } & {
  reviewStore?: Types.Maybe<
    { __typename?: 'ReviewStore' } & ReviewStoreTestFragment
  >;
};
