import gql from 'graphql-tag';

export const reviewStoreShopApiExtension = gql`
  type ReviewStore implements Node {
    id: ID!
    title: String!
    description: String!
    nps: Int!
    customerName: String
    customerNameIsPublic: Boolean!
  }
  input CreateReviewStoreInput {
    title: String!
    description: String!
    nps: Int!
    customerNameIsPublic: Boolean!
  }
  input UpdateReviewStoreInput {
    title: String
    description: String
    nps: Int
    customerNameIsPublic: Boolean
  }

  type ReviewStoreList implements PaginatedList {
    items: [ReviewStore!]!
    totalItems: Int!
  }

  extend type Mutation {
    createReviewStore(input: CreateReviewStoreInput!): ReviewStore
    updateReviewStore(input: UpdateReviewStoreInput): ReviewStore
  }
  extend type Query {
    "Get the average of review store"
    avgReviewStore: Float

    "Get the review store of the current customer"
    myReviewStore: ReviewStore

    "Get the list of reviews store"
    reviewsStore(options: ReviewStoreListOptions): ReviewStoreList!
  }
  input ReviewStoreListOptions
`;
