import gql from 'graphql-tag';

export const reviewProductAdminApiExtension = gql`
  type ReviewProduct implements Node {
    id: ID!
    title: String!
    description: String!
    state: String!
    stars: Int!
    nextStates: [String!]!
    customer: Customer!
    product: Product!
    customerNameIsPublic: Boolean
  }
  type ReviewProductList implements PaginatedList {
    items: [ReviewProduct!]!
    totalItems: Int!
  }

  extend type Mutation {
    transitionReviewProductToState(id: ID!, state: String!): ReviewProduct
  }
  extend type Query {
    "Get the review product"
    reviewProduct(id: ID!): ReviewProduct

    "Get the list of reviews product"
    reviewsProduct(options: ReviewProductListOptions): ReviewProductList!
  }

  input ReviewProductListOptions
`;
