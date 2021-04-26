import React, { FC, HTMLAttributes, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { MicroAppDataUsageLog, MicroAppData } from 'models/micro-app';
import { SimpleUser } from 'models/user';

import { GET_SIMPLE_USER } from 'api/graphql/user';
import { GET_MICRO_APP_DATA } from 'api/graphql/microApp';

import { combineClassNames } from 'utilities/functions';

interface UsageLogProps extends HTMLAttributes<HTMLDivElement> {
  microAppDataUsageLog: MicroAppDataUsageLog;
}

export const UsageLog: FC<UsageLogProps> = ({
  microAppDataUsageLog: { id, simpleUserId, microAppDataId },
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

  useEffect(() => {
    if (typeof simpleUserError !== 'undefined')
      console.log('error retrieving simple user information');
    if (typeof microAppDataError !== 'undefined')
      console.log('error retrieving micro app data information');
  }, [simpleUserError, microAppDataError]);

  return (
    <div
      {...props}
      className={combineClassNames('space-y-4', props?.className)}>
      <p>{id}</p>
      {simpleUser ? <p>{simpleUser.id}</p> : null}
      {microAppData ? <p>{microAppData.id}</p> : null}
    </div>
  );
};
