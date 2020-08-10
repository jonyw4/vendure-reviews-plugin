import gql from 'graphql-tag';

export const SHOP_REVIEW_STORE_FRAGMENT = gql`
  fragment ShopReviewStore on ReviewStore {
    id
    title
    description
    nps
  }
`;

export const SHOP_CREATE_REVIEW_STORE = gql`
  mutation CreateReviewStore($input: CreateReviewStoreInput!) {
    createReviewStore(input: $input) {
      ...ShopReviewStore
    }
  }
  ${SHOP_REVIEW_STORE_FRAGMENT}
`;

export const SHOP_MY_REVIEW_STORE = gql`
  query MyReviewStore {
    myReviewStore {
      ...ShopReviewStore
    }
  }
  ${SHOP_REVIEW_STORE_FRAGMENT}
`;
export const SHOP_AVG_REVIEW_STORE = gql`
  query AvgReviewStore {
    avgReviewStore
  }
`;
