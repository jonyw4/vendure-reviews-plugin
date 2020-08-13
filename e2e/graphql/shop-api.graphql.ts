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

export const SHOP_UPDATE_REVIEW_STORE = gql`
  mutation UpdateReviewStore($input: UpdateReviewStoreInput!) {
    updateReviewStore(input: $input) {
      ...ShopReviewStore
    }
  }
  ${SHOP_REVIEW_STORE_FRAGMENT}
`;

export const SHOP_REVIEWS_STORE = gql`
  query ListReviewStore {
    reviewsStore {
      items {
        ...ShopReviewStore
      }
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

export const SHOP_REVIEW_PRODUCT_FRAGMENT = gql`
  fragment ShopReviewProduct on ReviewProduct {
    id
    title
    description
    stars
  }
`;

export const SHOP_AVAILABLE_PRODUCTS_REVIEW = gql`
  query AvailableProductsReview {
    availableProductsToReview {
      items {
        id
        name
      }
    }
  }
`;

export const SHOP_REVIEW_PRODUCT = gql`
  query ReviewProduct($id: ID!) {
    reviewProduct(id: $id) {
      ...ShopReviewProduct
    }
  }
  ${SHOP_REVIEW_PRODUCT_FRAGMENT}
`;

export const SHOP_REVIEWS_PRODUCT = gql`
  query ListReviewProduct {
    reviewsProduct {
      items {
        ...ShopReviewProduct
      }
    }
  }
  ${SHOP_REVIEW_PRODUCT_FRAGMENT}
`;
export const SHOP_CREATE_REVIEW_PRODUCT = gql`
  mutation CreateReviewProduct($input: CreateReviewProductInput!) {
    createReviewProduct(input: $input) {
      ...ShopReviewProduct
    }
  }
  ${SHOP_REVIEW_PRODUCT_FRAGMENT}
`;

export const SHOP_UPDATE_REVIEW_PRODUCT = gql`
  mutation UpdateReviewProduct($input: UpdateReviewProductInput!) {
    updateReviewProduct(input: $input) {
      ...ShopReviewProduct
    }
  }
  ${SHOP_REVIEW_PRODUCT_FRAGMENT}
`;

export const SHOP_PRODUCT_REVIEW = gql`
  query ProductReview {
    product(id: "T_1") {
      id
      reviewAvg
      reviews {
        items {
          ...ShopReviewProduct
        }
      }
      canReview
    }
  }
  ${SHOP_REVIEW_STORE_FRAGMENT}
`;
