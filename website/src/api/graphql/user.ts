import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      ... on User {
        id
        username
        firstName
        lastName
        createdAt
      }
    }
  }
`;

export const GET_SIMPLE_USER = gql`
  query simpleUser($id: String, $identifier: String) {
    simpleUser(where: { id: $id, identifier: $identifier }) {
      id
      identifier
      createdAt
      lastSeen
    }
  }
`;
