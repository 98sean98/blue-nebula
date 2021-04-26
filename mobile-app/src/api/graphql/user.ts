import { gql } from '@apollo/client';

export const GET_USER = gql`
  query user($id: String, $username: String) {
    user(where: { id: $id, username: $username }) {
      id
      username
      firstName
      lastName
      createdAt
    }
  }
`;

export const GET_ME = gql`
  query me($identifier: String) {
    me(identifier: $identifier) {
      ... on User {
        id
        username
        firstName
        lastName
        createdAt
      }
      ... on SimpleUser {
        id
      }
    }
  }
`;
