import gql from 'graphql-tag';

export const REVIEW_STORE_FRAGMENT = gql`
  fragment ReviewStore on ReviewStore {
    id
    title
    description
    state
    nps
    nextStates
    customer {
      id
      firstName
    }
  }
`;
