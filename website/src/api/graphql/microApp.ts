import { gql } from '@apollo/client';

export const GET_ALL_MICRO_APPS_HEADERS = gql`
  query microApps {
    microApps(orderBy: { name: asc }) {
      id
      name
      activeVersion
    }
  }
`;

export const GET_MICRO_APP_DATA = gql`
  query microAppData($id: String) {
    findUniqueMicroAppData(where: { id: $id }) {
      id
      microAppId
      name
      version
      data
      createdAt
      creatorId
    }
  }
`;

export const GET_MICRO_APP_DATA_USAGE_LOGS = gql`
  query microAppDataUsageLogs($microAppId: String, $microAppName: String) {
    microAppDataUsageLogs(
      where: {
        microAppData: {
          is: {
            microApp: {
              is: {
                OR: [
                  { id: { equals: $microAppId } }
                  { name: { equals: $microAppName } }
                ]
              }
            }
          }
        }
      }
      orderBy: { timestamp: desc }
    ) {
      id
      simpleUserId
      microAppDataId
      timestamp
      locationLatitude
      locationLongitude
    }
  }
`;
