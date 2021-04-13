import { gql } from '@apollo/client';

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
