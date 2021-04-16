import React, { FC, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { DataGrid, GridColDef, GridRowData } from '@material-ui/data-grid';

import { MicroAppDataUsageLog } from 'models/micro-app';

import { GET_MICRO_APP_DATA_USAGE_LOGS } from 'api/graphql/microApp';

import { formatDate } from 'utilities/functions';

interface UsageProps {
  microAppId: string;
}

const tableColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1 },
  {
    field: 'timestamp',
    headerName: 'Timestamp',
    type: 'dateTime',
    width: 200,
    valueFormatter: (params) => formatDate(params.value as string),
  },
  {
    field: 'simpleUserId',
    headerName: 'User ID',
    flex: 2,
  },
  {
    field: 'locationLatitude',
    headerName: 'Location latitude',
    sortable: false,
    flex: 1,
  },
  {
    field: 'locationLongitude',
    headerName: 'Location longitude',
    sortable: false,
    flex: 1,
  },
];

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

  const tableRows: GridRowData[] = useMemo(() => usageLogs, [usageLogs]);

  return (
    <DataGrid
      pageSize={10}
      {...props}
      rows={tableRows}
      columns={tableColumns}
    />
  );
};
