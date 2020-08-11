import gql from 'graphql-tag';
import { REVIEW_STORE_FRAGMENT } from '../../common/fragments.graphql';

export const GET_REVIEW_STORE_LIST = gql`
  query GetPackageList($options: ReviewStoreListOptions!) {
    reviewsStore(options: $options) {
      items {
        ...ReviewStore
      }
      totalItems
    }
  }
  ${REVIEW_STORE_FRAGMENT}
`;
