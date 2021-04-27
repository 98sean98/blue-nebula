import React, { FC, HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import Select from 'react-select';

import { MicroAppHeaders } from 'models/micro-app';

import { GET_ALL_MICRO_APPS_HEADERS } from 'api/graphql/microApp';

import { Usage } from './Usage';

import { combineClassNames } from 'utilities/functions';

interface MicroAppsProps extends HTMLAttributes<HTMLDivElement> {}

export const MicroApps: FC<MicroAppsProps> = ({ ...props }) => {
  const { data, error } = useQuery(GET_ALL_MICRO_APPS_HEADERS, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (typeof error !== 'undefined') {
      console.log(error);
      alert('There was an error while fetching for the micro app headers.');
    }
  }, [error]);

  const microAppsHeaders: MicroAppHeaders[] = useMemo(
    () =>
      typeof data !== 'undefined' && data.microApps !== null
        ? data.microApps
        : [],
    [data],
  );

  const [selectedMicroAppId, setSelectedMicroAppId] = useState<string>();

  const selectedMicroApp = useMemo(
    () => microAppsHeaders.find(({ id }) => id === selectedMicroAppId),
    [microAppsHeaders, selectedMicroAppId],
  );

  const selectValue = useMemo(
    () =>
      selectedMicroApp && {
        value: selectedMicroApp.id,
        label: selectedMicroApp.name,
      },
    [selectedMicroApp],
  );

  const microAppSelectorOptions = useMemo(
    () => microAppsHeaders.map(({ id, name }) => ({ value: id, label: name })),
    [microAppsHeaders],
  );

  const onMicroAppSelectorChange = (
    selectedOption: {
      value: string;
      label: string;
    } | null,
  ) => {
    if (selectedOption) setSelectedMicroAppId(selectedOption.value);
  };

  return (
    <div
      {...props}
      className={combineClassNames(
        'flex flex-col space-y-4',
        props?.className,
      )}>
      <Select
        placeholder={'Select micro app'}
        options={microAppSelectorOptions}
        value={selectValue}
        onChange={onMicroAppSelectorChange}
      />

      {typeof selectedMicroAppId !== 'undefined' ? (
        <div className={'flex-grow flex flex-col w-full overflow-x-auto'}>
          <div className={'flex-grow flex flex-col'} style={{ minWidth: 800 }}>
            <Usage microAppId={selectedMicroAppId} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
