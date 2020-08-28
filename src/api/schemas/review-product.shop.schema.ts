import gql from 'graphql-tag';

export const reviewProductShopApiExtension = gql`
  type ReviewProduct implements Node {
    id: ID!
    title: String!
    description: String!
    stars: Int!
    product: Product!
    customerName: String
    customerNameIsPublic: Boolean!
  }
  input CreateReviewProductInput {
    productId: ID!
    title: String!
    description: String!
    stars: Int!
    customerNameIsPublic: Boolean!
  }
  input UpdateReviewProductInput {
    id: ID!
    title: String
    description: String
    stars: Int
    customerNameIsPublic: Boolean
  }
  type ReviewProductList implements PaginatedList {
    items: [ReviewProduct!]!
    totalItems: Int!
  }
  extend type Product {
    reviewAvg: Float!
    reviews(options: ReviewProductListOptions): ReviewProductList!
    "Use this in your Storefront to show in product page if user can create a review"
    canReview: Boolean
  }
  extend type Query {
    "A list of available products to user review"
    availableProductsToReview(options: ProductListOptions): ProductList!
    reviewProduct(id: ID!): ReviewProduct
    reviewsProduct(options: ReviewProductListOptions): ReviewProductList!
  }
  extend type Mutation {
    createReviewProduct(input: CreateReviewProductInput!): ReviewProduct
    updateReviewProduct(input: UpdateReviewProductInput!): ReviewProduct
  }
  input ReviewProductListOptions
`;
