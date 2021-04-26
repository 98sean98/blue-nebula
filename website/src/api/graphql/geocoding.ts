import { gql } from '@apollo/client';

export const REVERSE_GEOCODING = gql`
  query reverseGeocoding($latitude: Float!, $longitude: Float!) {
    reverseGeocoding(where: { latitude: $latitude, longitude: $longitude }) {
      label
      name
    }
  }
`;
