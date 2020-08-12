import gql from 'graphql-tag';

export const reviewProductShopApiExtension = gql`
  type ReviewProduct implements Node {
    id: ID!
    title: String!
    description: String!
    stars: Int!
  }
  input CreateReviewProductInput {
    productId: ID!
    title: String!
    description: String!
    stars: Int!
  }
  input UpdateReviewProductInput {
    id: ID!
    title: String
    description: String
    stars: Int
  }
  type ReviewProductList implements PaginatedList {
    items: [ReviewProduct!]!
    totalItems: Int!
  }
  extend type Product {
    reviewAvg: Int!
    reviews(options: ReviewProductListOptions): ReviewProductList!
    canReview: Boolean
  }
  extend type Mutation {
    createReviewProduct(input: CreateReviewProductInput!): ReviewProduct
    updateReviewProduct(input: UpdateReviewProductInput!): ReviewProduct
  }
  input ReviewProductListOptions
`;
