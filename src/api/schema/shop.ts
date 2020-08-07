import gql from 'graphql-tag';
import { commonApiExtensions } from './common';

export const shopApiExtensions = gql`
  ${commonApiExtensions}
  input CreateReviewStoreInput {
    title: String!
    description: String!
    nps: Int!
  }
  extend type Mutation {
    createReviewStore(input: CreateReviewStoreInput!): ReviewStore
  }
  extend type Query {
    "Get the average of review store"
    avgReviewStore: Int

    "Get the review store of the current customer"
    myReviewStore: ReviewStore
  }
`;
