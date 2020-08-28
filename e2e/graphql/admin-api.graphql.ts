import gql from 'graphql-tag';

export const ADMIN_REVIEW_STORE_FRAGMENT = gql`
  fragment AdminReviewStore on ReviewStore {
    id
    title
    description
    state
    nps
    nextStates
    customerNameIsPublic
    customer {
      id
      firstName
    }
  }
`;

export const ADMIN_CUSTOMER_LIST = gql`
  query CustomerList {
    customers(options: { take: 3 }) {
      items {
        id
        emailAddress
      }
    }
  }
`;

export const ADMIN_REVIEW_STORE = gql`
  query ReviewStore($id: ID!) {
    reviewStore(id: $id) {
      ...AdminReviewStore
    }
  }
  ${ADMIN_REVIEW_STORE_FRAGMENT}
`;

export const ADMIN_REVIEWS_STORE = gql`
  query ListReviewStore {
    reviewsStore {
      items {
        ...AdminReviewStore
      }
    }
  }
  ${ADMIN_REVIEW_STORE_FRAGMENT}
`;

export const ADMIN_AVG_REVIEW_STORE = gql`
  query AvgReviewStore {
    avgReviewStore
  }
`;

export const ADMIN_TRANSITION_REVIEW_STORE = gql`
  mutation transitionReviewStoreToState($id: ID!, $state: String!) {
    transitionReviewStoreToState(id: $id, state: $state) {
      ...AdminReviewStore
    }
  }
  ${ADMIN_REVIEW_STORE_FRAGMENT}
`;

export const ADMIN_REVIEW_PRODUCT_FRAGMENT = gql`
  fragment AdminReviewProduct on ReviewProduct {
    id
    title
    description
    state
    stars
    nextStates
    customerNameIsPublic
    customer {
      id
      firstName
    }
    product {
      id
      name
    }
  }
`;

export const ADMIN_REVIEW_PRODUCT = gql`
  query ReviewProduct($id: ID!) {
    reviewProduct(id: $id) {
      ...AdminReviewProduct
    }
  }
  ${ADMIN_REVIEW_PRODUCT_FRAGMENT}
`;

export const ADMIN_REVIEWS_PRODUCT = gql`
  query ListReviewProduct {
    reviewsProduct {
      items {
        ...AdminReviewProduct
      }
    }
  }
  ${ADMIN_REVIEW_PRODUCT_FRAGMENT}
`;

export const ADMIN_TRANSITION_REVIEW_PRODUCT = gql`
  mutation transitionReviewProductToState($id: ID!, $state: String!) {
    transitionReviewProductToState(id: $id, state: $state) {
      ...AdminReviewProduct
    }
  }
  ${ADMIN_REVIEW_PRODUCT_FRAGMENT}
`;
