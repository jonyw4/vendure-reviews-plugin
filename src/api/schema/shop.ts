import gql from 'graphql-tag';

export const shopApiExtensions = gql`
  type ReviewStore implements Node {
    id: ID!
    title: String!
    description: String!
    nps: Int!
  }
  input CreateReviewStoreInput {
    title: String!
    description: String!
    nps: Int!
  }
  input UpdateReviewStoreInput {
    title: String
    description: String
    nps: Int
  }
  extend type Mutation {
    createReviewStore(input: CreateReviewStoreInput!): ReviewStore
    updateReviewStore(input: UpdateReviewStoreInput): ReviewStore
  }
  extend type Query {
    "Get the average of review store"
    avgReviewStore: Int

    "Get the review store of the current customer"
    myReviewStore: ReviewStore
  }
`;
