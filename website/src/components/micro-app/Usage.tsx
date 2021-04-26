import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridRowParams,
} from '@material-ui/data-grid';
import { Modal } from '@material-ui/core';

import { MicroAppDataUsageLog } from 'models/micro-app';

import { GET_MICRO_APP_DATA_USAGE_LOGS } from 'api/graphql/microApp';

import { UsageLog } from './UsageLog';

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
    headerName: 'Location Latitude',
    sortable: false,
    flex: 1,
  },
  {
    field: 'locationLongitude',
    headerName: 'Location Longitude',
    sortable: false,
    flex: 1,
  },
];

export const Usage: FC<UsageProps> = ({ microAppId, ...props }) => {
  const { data, loading, error } = useQuery(GET_MICRO_APP_DATA_USAGE_LOGS, {
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

  const [selectedRowId, setSelectedRowId] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onRowClick = useCallback((param: GridRowParams) => {
    setSelectedRowId(param.id as string);
    setIsModalOpen(true);
  }, []);

  const selectedUsageLog = useMemo(
    () => usageLogs.find(({ id }) => id === selectedRowId),
    [usageLogs, selectedRowId],
  );

  return (
    <>
      <DataGrid
        pageSize={10}
        loading={loading}
        disableSelectionOnClick
        onRowClick={onRowClick}
        {...props}
        rows={tableRows}
        columns={tableColumns}
      />
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {typeof selectedUsageLog !== 'undefined' ? (
          <div
            className={
              'absolute top-1/2 left-1/2 w-2/3 transform -translate-x-1/2 -translate-y-1/2'
            }>
            <UsageLog
              microAppDataUsageLog={selectedUsageLog}
              className={'bg-white'}
            />
          </div>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
};
