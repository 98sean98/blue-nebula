import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query users {
    users {
      id
      username
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
