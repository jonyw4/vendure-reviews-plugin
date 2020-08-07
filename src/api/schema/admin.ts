import { commonApiExtensions } from './common';
import gql from 'graphql-tag';

export const adminApiExtensions = gql`
  ${commonApiExtensions}
  extend type Review {
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

    "Get the review store of the current customer"
    reviewStore: ReviewStore

    "Get the list of reviews store"
    reviewsStore(options: PackageListOptions): ReviewStoreList!
  }

  input PackageListOptions
`;
