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
