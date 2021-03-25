import React, { FC, useMemo } from 'react';
import {
  IndexPath,
  Select,
  SelectItem,
  SelectProps,
} from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { MicroAppHeaders } from '@models/application';

import { GET_ALL_MICRO_APPS_HEADERS } from '@api/graphql/microApp';

import {
  setFocusedMicroAppHeaders,
  setShouldFetchMicroApp,
} from '@reduxApp/application/actions';
import { RootState } from '@reduxApp';

import { useApplicationQuery } from '@utilities/hooks';

interface MicroAppSelectorProps extends SelectProps {}

export const MicroAppSelector: FC<MicroAppSelectorProps> = ({ ...props }) => {
  const dispatch = useDispatch();

  const { focusedMicroAppHeaders } = useSelector(
    (state: RootState) => state.application,
  );

  const { data: queryData } = useApplicationQuery([GET_ALL_MICRO_APPS_HEADERS]);

  const data: MicroAppHeaders[] = useMemo(() => {
    const typedQueryData = queryData as
      | { microApps: MicroAppHeaders[] }
      | undefined;
    if (typeof typedQueryData !== 'undefined') return typedQueryData.microApps;
    else return [];
  }, [queryData]);

  const selectedIndex = useMemo(() => {
    const foundIndex = data.findIndex(
      ({ id }) => id === focusedMicroAppHeaders?.id,
    );
    return new IndexPath(Math.max(foundIndex, 0));
  }, [focusedMicroAppHeaders, data]);
  const setSelectedIndex = (newIndex: IndexPath) => {
    const selectedMicroAppHeaders = data[newIndex.row];
    dispatch(setFocusedMicroAppHeaders(selectedMicroAppHeaders));
    dispatch(setShouldFetchMicroApp(true));
  };

  return (
    <Select
      value={data[selectedIndex.row]?.name}
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index as IndexPath)}
      label={'Currently Loaded Micro App'}
      {...props}>
      {data.map(({ id, name }) => (
        <SelectItem key={id} title={name} />
      ))}
    </Select>
  );
};
