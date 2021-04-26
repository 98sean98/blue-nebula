import React, {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import { MicroAppDataUsageLog, MicroAppData } from 'models/micro-app';
import { SimpleUser } from 'models/user';
import { ReverseGeocoding } from 'models/geocoding';

import { GET_SIMPLE_USER } from 'api/graphql/user';
import { GET_MICRO_APP_DATA } from 'api/graphql/microApp';
import { REVERSE_GEOCODING } from 'api/graphql/geocoding';

import { combineClassNames, formatDate } from 'utilities/functions';

interface UsageLogProps extends HTMLAttributes<HTMLDivElement> {
  microAppDataUsageLog: MicroAppDataUsageLog;
}

export const UsageLog: FC<UsageLogProps> = ({
  microAppDataUsageLog: {
    id,
    simpleUserId,
    microAppDataId,
    timestamp,
    locationLatitude,
    locationLongitude,
  },
  ...props
}) => {
  const {
    data: simpleUserData,
    error: simpleUserError,
  } = useQuery(GET_SIMPLE_USER, { variables: { id: simpleUserId } });

  const {
    data: microAppDataData,
    error: microAppDataError,
  } = useQuery(GET_MICRO_APP_DATA, { variables: { id: microAppDataId } });

  const [
    fetchReverseGeocoding,
    { data: reverseGeocodingData, error: reverseGeocodingError },
  ] = useLazyQuery(REVERSE_GEOCODING);

  useEffect(() => {
    if (locationLatitude && locationLongitude)
      fetchReverseGeocoding({
        variables: { latitude: locationLatitude, longitude: locationLongitude },
      });
  }, [locationLatitude, locationLongitude, fetchReverseGeocoding]);

  const simpleUser: SimpleUser | undefined = useMemo(
    () =>
      typeof simpleUserData !== 'undefined' &&
      simpleUserData.simpleUser !== null
        ? simpleUserData.simpleUser
        : undefined,
    [simpleUserData],
  );

  const microAppData: MicroAppData | undefined = useMemo(
    () =>
      typeof microAppDataData !== 'undefined' &&
      microAppDataData.findUniqueMicroAppData !== null
        ? microAppDataData.findUniqueMicroAppData
        : undefined,
    [microAppDataData],
  );

  const reverseGeocoding: ReverseGeocoding | undefined = useMemo(
    () =>
      typeof reverseGeocodingData !== 'undefined' &&
      reverseGeocodingData.reverseGeocoding !== null
        ? reverseGeocodingData.reverseGeocoding
        : undefined,
    [reverseGeocodingData],
  );

  useEffect(() => {
    if (typeof simpleUserError !== 'undefined')
      console.log('error retrieving simple user information', simpleUserError);
    if (typeof microAppDataError !== 'undefined')
      console.log(
        'error retrieving micro app data information',
        microAppDataError,
      );
    if (typeof reverseGeocodingError !== 'undefined')
      console.log(
        'error getting reverse geocoding information',
        reverseGeocodingError,
      );
  }, [simpleUserError, microAppDataError, reverseGeocodingError]);

  const renderRow = useCallback(
    (key: string, value: string) => (
      <div className={'flex flex-row'}>
        <p className={'w-1/3 text-basic-600'}>{key}</p>
        <p className={'ml-1'}>{value}</p>
      </div>
    ),
    [],
  );

  return (
    <div
      {...props}
      className={combineClassNames('space-y-3', props?.className)}>
      {renderRow('Usage Log ID', id)}
      {renderRow('Timestamp', formatDate(timestamp))}
      {typeof simpleUser !== 'undefined' ? (
        renderRow('User ID', simpleUser.identifier)
      ) : (
        <></>
      )}
      {typeof microAppData !== 'undefined' ? (
        renderRow(
          'Micro App Data',
          `${microAppData.name ?? microAppData.id} (version ${
            microAppData.version
          })`,
        )
      ) : (
        <></>
      )}
      {typeof reverseGeocoding !== 'undefined' ? (
        renderRow('Location', reverseGeocoding.label)
      ) : (
        <></>
      )}
    </div>
  );
};
