import { gql } from '@apollo/client';

export const GET_MICRO_APP_HEADERS = gql`
  query microApp($name: String!) {
    microApp(where: { name: $name }) {
      id
      name
      activeVersion
    }
  }
`;

export const GET_MICRO_APP = gql`
  query microApp($name: String!) {
    microApp(where: { name: $name }) {
      id
      name
      activeVersion
      createdAt
      updatedAt
      creatorId
      updaterId
    }
  }
`;

export const GET_MICRO_APP_WITH_ACTIVE_DATA = gql`
  query microApp($name: String!) {
    microAppWithActiveData(where: { name: $name }) {
      id
      name
      activeVersion
      activeMicroAppData {
        id
        name
        version
        data
        createdAt
        creatorId
      }
      createdAt
      updatedAt
      creatorId
      updaterId
    }
  }
`;

export const GET_ALL_MICRO_APPS_HEADERS = gql`
  query microApps {
    microApps(orderBy: { name: asc }) {
      id
      name
      activeVersion
    }
  }
`;

export const GET_ALL_MICRO_APP_DATA = gql`
  query microAppData($name: String!) {
    findManyMicroAppData(
      where: { microApp: { is: { name: { equals: $name } } } }
      orderBy: { version: desc }
    ) {
      id
      name
      version
      data
      createdAt
      creatorId
    }
  }
`;

export const UPDATE_MICRO_APP_DATA = gql`
  mutation updateMicroAppData($name: String!, $dataName: String, $data: JSON!) {
    updateMicroAppData(
      data: { dataName: $dataName, data: $data }
      where: { name: $name }
    ) {
      id
    }
  }
`;

export const UPDATE_MICRO_APP = gql`
  mutation updateMicroApp(
    $name: String!
    $activeVersion: Int!
    $updaterUsername: String!
  ) {
    updateMicroApp(
      data: {
        activeVersion: { set: $activeVersion }
        updater: { connect: { username: $updaterUsername } }
      }
      where: { name: $name }
    ) {
      activeVersion
    }
  }
`;
