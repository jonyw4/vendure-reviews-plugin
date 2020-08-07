import gql from 'graphql-tag';

export const commonApiExtensions = gql`
  interface ReviewBase {
    id: ID!
    title: String!
    description: String!
    state: String!
    createdAt: DateTime!
    updatedAt: DateTime
  }
  type ReviewStore implements ReviewBase {
    nps: Int!
  }
`;
