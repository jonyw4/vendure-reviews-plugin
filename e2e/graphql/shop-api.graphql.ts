import gql from 'graphql-tag';

export const SHOP_REVIEW_STORE_FRAGMENT = gql`
  fragment ReviewStoreTest on ReviewStore {
    id
    title
    description
  }
`;

export const SHOP_CREATE_REVIEW_STORE = gql`
  mutation CreateReviewStore($input: CreateReviewStoreInput!) {
    createReviewStore(input: $input) {
      ...ReviewStoreTest
    }
  }
  ${SHOP_REVIEW_STORE_FRAGMENT}
`;
