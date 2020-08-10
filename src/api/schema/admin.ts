import gql from 'graphql-tag';

export const adminApiExtensions = gql`
  type ReviewStore implements Node {
    id: ID!
    title: String!
    description: String!
    state: String!
    nps: Int!
    nextStates: [String!]!
  }
  type ReviewStoreList implements PaginatedList {
    items: [ReviewStore!]!
    totalItems: Int!
  }

  extend type Mutation {
    transitionReviewStoreToState(id: ID!, state: String!): ReviewStore
  }
  extend type Query {
    "Get the average of review store"
    avgReviewStore: Int

    "Get the review store"
    reviewStore(id: ID!): ReviewStore

    "Get the list of reviews store"
    reviewsStore(options: ReviewStoreListOptions): ReviewStoreList!
  }

  input ReviewStoreListOptions
`;
