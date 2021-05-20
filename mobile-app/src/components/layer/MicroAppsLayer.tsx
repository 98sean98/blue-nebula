import React, { FC, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import { MicroAppHeaders, MicroAppWithActiveData } from '@models/application';

import {
  GET_MICRO_APP_HEADERS,
  GET_MICRO_APP_WITH_ACTIVE_DATA,
} from '@api/graphql/microApp';

import { RootState } from '@reduxApp';
import {
  setApplicationAlert,
  setFocusedMicroAppHeaders,
  setIsLoading,
  setShouldFetchMicroApp,
} from '@reduxApp/application/actions';

import {
  clearAllControlEntities,
  setControlEntities,
} from '@reduxApp/control/actions';
import { SetControlEntities } from '@reduxApp/control/types';
import {
  clearAllSetups,
  clearMakerConfig,
  setMakerConfig,
  setSetups,
} from '@reduxApp/builder/actions';
import { SetMakerConfig, SetSetups } from '@reduxApp/builder/types';

import {
  convertObjectWithTimestampKeys,
  convertStateWithTimestamps,
} from '@utilities/functions/object-convert';
import { ConvertibleState } from '@utilities/functions/object-convert/convertStateWithTimestamps';
import { ConvertibleObject } from '@utilities/functions/object-convert/convertObjectWithTimestampKeys';
import { useApplicationQuery } from '@utilities/hooks';

export const MicroAppsLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const authorizationToken = useSelector(
    (state: RootState) => state.auth.authorizationToken,
  );
  const { focusedMicroAppHeaders, shouldFetchMicroApp } = useSelector(
    (state: RootState) => state.application,
  );

  const microAppName = useMemo(
    () => focusedMicroAppHeaders?.name ?? 'Micro App',
    [focusedMicroAppHeaders],
  );
  const microAppQueryVariables = useMemo(
    () => ({ name: focusedMicroAppHeaders?.name ?? '' }),
    [focusedMicroAppHeaders],
  );

  const isLoggedIn = useMemo(() => typeof authorizationToken !== 'undefined', [
    authorizationToken,
  ]);

  const { data: microAppHeaders } = useApplicationQuery(
    [
      GET_MICRO_APP_HEADERS,
      {
        variables: microAppQueryVariables,
        fetchPolicy: 'network-only',
      },
    ],
    {
      errorConfig: {
        title: `${microAppName} Headers Query Error`,
        message: `There was an error fetching this micro app's headers from the server.`,
      },
    },
  );
  const [
    loadAppData,
    {
      data: microAppData,
      loading: microAppDataLoading,
      error: microAppDataError,
      called: microAppDataCalled,
    },
  ] = useLazyQuery(GET_MICRO_APP_WITH_ACTIVE_DATA, {
    fetchPolicy: 'network-only',
  });

  // loading effect
  useEffect(() => {
    dispatch(setIsLoading(microAppDataLoading));
  }, [dispatch, microAppDataLoading]);

  // error effect
  useEffect(() => {
    if (typeof microAppDataError !== 'undefined')
      dispatch(
        setApplicationAlert({
          title: `${microAppName} Data Query Error`,
          message: `There was an error fetching this micro app's data from the server.`,
        }),
      );
  }, [dispatch, microAppDataError, microAppName]);

  // set focused micro app headers
  useEffect(() => {
    const typedMicroAppHeaders = microAppHeaders as
      | { microApp: MicroAppHeaders | null }
      | undefined;
    if (
      typeof typedMicroAppHeaders !== 'undefined' &&
      typedMicroAppHeaders.microApp !== null
    ) {
      const { id, name, activeVersion } = typedMicroAppHeaders.microApp;
      dispatch(setFocusedMicroAppHeaders({ id, name, activeVersion }));
    }
  }, [dispatch, microAppHeaders]);

  // query the micro app data lazily based on the headers
  useEffect(() => {
    // delay the first call to check if the user is logged in; if the user is logged in, do not make first call
    if (shouldFetchMicroApp) {
      loadAppData({ variables: microAppQueryVariables });
      dispatch(setShouldFetchMicroApp(false));
    } else if (!microAppDataCalled) {
      const timeout = setTimeout(() => {
        if (!isLoggedIn) loadAppData({ variables: microAppQueryVariables });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [
    dispatch,
    loadAppData,
    microAppQueryVariables,
    microAppDataCalled,
    isLoggedIn,
    shouldFetchMicroApp,
  ]);

  // destructure micro app data, and put into redux store
  useEffect(() => {
    if (typeof microAppData !== 'undefined' && microAppData !== null) {
      const microAppWithActiveData = microAppData.microAppWithActiveData as MicroAppWithActiveData;
      // if null, escape function execution
      if (!microAppWithActiveData?.activeMicroAppData) return;

      const { controlEntities, setups, makerConfig } = JSON.parse(
        microAppWithActiveData.activeMicroAppData.data,
      );

      // set control entities
      if (typeof controlEntities !== 'undefined') {
        dispatch(clearAllControlEntities());
        dispatch(setControlEntities(controlEntities as SetControlEntities));
      }

      // set setups
      if (typeof setups !== 'undefined') {
        const setupsWithConvertedTimestamps = convertStateWithTimestamps(
          setups as ConvertibleState,
          ['createdAt', 'updatedAt'],
        );
        dispatch(clearAllSetups());
        dispatch(setSetups(setupsWithConvertedTimestamps as SetSetups));
      }

      // set app maker config
      if (typeof makerConfig !== 'undefined') {
        const makerConfigWithConvertedTimestamps = convertObjectWithTimestampKeys(
          makerConfig as ConvertibleObject,
          ['updatedAt'],
        );
        dispatch(clearMakerConfig());
        dispatch(
          setMakerConfig(makerConfigWithConvertedTimestamps as SetMakerConfig),
        );
      }

      console.log(`finished loading the micro app's data into redux!`);
    }
  }, [dispatch, microAppData]);

  return <>{children}</>;
};
