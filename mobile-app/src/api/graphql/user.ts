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
  query me {
    me {
      id
      username
      firstName
      lastName
      createdAt
    }
  }
`;
