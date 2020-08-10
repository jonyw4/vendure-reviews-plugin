import gql from 'graphql-tag';

export const ADMIN_REVIEW_STORE_FRAGMENT = gql`
  fragment ReviewStoreTest on ReviewStore {
    id
    title
    description
    state
    nps
    nextStates
  }
`;

export const ADMIN_REVIEW_STORE = gql`
  query ReviewStore($id: ID!) {
    reviewStore(id: $id) {
      ...ReviewStoreTest
    }
  }
  ${ADMIN_REVIEW_STORE_FRAGMENT}
`;
