import { gql } from '@apollo/client';

export const GET_MICRO_APPS_HEADERS = gql`
  query microApps {
    microApps {
      id
      name
      activeVersion
    }
  }
`;

export const GET_MICRO_APP_HEADER = gql`
  query microApp($name: String!) {
    microApp(where: { name: $name }) {
      id
      name
      activeVersion
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

export const GET_LATEST_MICRO_APP_DATA_VERSION = gql`
  query aggregateMicroAppData($name: String!) {
    aggregateMicroAppData(
      where: { microApp: { is: { name: { equals: $name } } } }
    ) {
      max {
        version
      }
    }
  }
`;

export const UPDATE_MICRO_APP_DATA = gql`
  mutation updateMicroApp(
    $name: String!
    $dataName: String
    $version: Int!
    $data: JSON!
    $updaterUsername: String!
  ) {
    updateMicroApp(
      data: {
        activeVersion: { set: $version }
        microAppDataList: {
          create: {
            name: $dataName
            version: $version
            data: $data
            creator: { connect: { username: $updaterUsername } }
          }
        }
        updater: { connect: { username: $updaterUsername } }
      }
      where: { name: $name }
    ) {
      id
    }
  }
`;
