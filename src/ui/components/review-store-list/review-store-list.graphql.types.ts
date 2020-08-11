import * as Types from '../../common/generated-admin-schema';

import { ReviewStoreFragment } from '../../common/fragments.graphql.types';

export type GetPackageListQueryVariables = Types.Exact<{
  options: Types.ReviewStoreListOptions;
}>;

export type GetPackageListQuery = { __typename?: 'Query' } & {
  reviewsStore: { __typename?: 'ReviewStoreList' } & Pick<
    Types.ReviewStoreList,
    'totalItems'
  > & { items: Array<{ __typename?: 'ReviewStore' } & ReviewStoreFragment> };
};
