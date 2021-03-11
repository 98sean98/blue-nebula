import { gql } from '@apollo/client';

export const GET_MICRO_APPS_HEADERS = gql`
  query microApps {
    microApps {
      id
      name
      version
    }
  }
`;

export const GET_MICRO_APP_HEADER = gql`
  query microApp($name: String!) {
    microApp(where: { name: $name }) {
      id
      name
      version
    }
  }
`;

export const GET_MICRO_APP_DATA = gql`
  query microApp($name: String!) {
    microApp(where: { name: $name }) {
      id
      name
      version
      data
      createdAt
      updatedAt
      creatorId
      updaterId
    }
  }
`;
