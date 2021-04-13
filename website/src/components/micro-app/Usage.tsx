import React, { FC, HTMLAttributes, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { MicroAppDataUsageLog } from 'models/micro-app';

import { GET_MICRO_APP_DATA_USAGE_LOGS } from 'api/graphql/microApp';

import { UsageLog } from './UsageLog';

interface UsageProps extends HTMLAttributes<HTMLDivElement> {
  microAppId: string;
}

export const Usage: FC<UsageProps> = ({ microAppId, ...props }) => {
  const { data, error } = useQuery(GET_MICRO_APP_DATA_USAGE_LOGS, {
    variables: { microAppId },
  });

  useEffect(() => {
    if (typeof error !== 'undefined')
      console.log('error retrieving usage logs');
  }, [error]);

  const usageLogs: MicroAppDataUsageLog[] = useMemo(
    () =>
      typeof data !== 'undefined' && data.microAppDataUsageLogs !== null
        ? data.microAppDataUsageLogs
        : [],
    [data],
  );

  return (
    <div {...props}>
      {usageLogs.map((usageLog, index) => (
        <UsageLog key={index} microAppDataUsageLog={usageLog} />
      ))}
    </div>
  );
};
