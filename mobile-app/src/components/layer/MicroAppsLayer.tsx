import React, { FC, useEffect, useMemo } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MicroApp, MicroAppHeaders } from '@models/application';

import {
  GET_MICRO_APP_WITH_ACTIVE_DATA,
  GET_MICRO_APPS_HEADERS,
} from '@api/graphql/microApp';

import { RootState } from '@reduxApp';
import {
  setApplicationError,
  setIsLoading,
  setShouldFetchMicroApps,
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

export const MicroAppsLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const authorizationToken = useSelector(
    (state: RootState) => state.auth.authorizationToken,
  );
  const { focusedMicroAppHeaders, shouldFetchMicroApps } = useSelector(
    (state: RootState) => state.application,
  );

  const isLoggedIn = useMemo(() => typeof authorizationToken !== 'undefined', [
    authorizationToken,
  ]);

  const {
    data: microAppsHeaders,
    loading: microAppsHeadersLoading,
    error: microAppsHeadersError,
  } = useQuery(GET_MICRO_APPS_HEADERS);
  const [
    loadAppData,
    {
      data: microAppData,
      loading: microAppDataLoading,
      error: microAppDataError,
      called: microAppDataCalled,
    },
  ] = useLazyQuery(GET_MICRO_APP_WITH_ACTIVE_DATA, { fetchPolicy: 'network-only' });

  // loading effect
  useEffect(() => {
    if (microAppsHeadersLoading || microAppDataLoading)
      dispatch(setIsLoading(true));
    else if (!microAppsHeadersLoading && !microAppDataLoading)
      dispatch(setIsLoading(false));
  }, [dispatch, microAppsHeadersLoading, microAppDataLoading]);

  // error effect
  useEffect(() => {
    if (microAppsHeadersError)
      dispatch(
        setApplicationError({
          title: 'Micro Apps Fetch Error',
          message:
            'There was an error fetching all micro apps from the server.',
        }),
      );
    if (microAppDataError)
      dispatch(
        setApplicationError({
          title: `${
            focusedMicroAppHeaders?.name ?? 'Micro App'
          } Data Fetch Error`,
          message: `There was an error fetching this micro app's data from the server.`,
        }),
      );
  }, [
    dispatch,
    microAppsHeadersError,
    microAppDataError,
    focusedMicroAppHeaders,
  ]);

  // query the micro app data lazily based on the headers
  useEffect(() => {
    // todo: check micro app version before querying
    if (typeof focusedMicroAppHeaders !== 'undefined') {
      const variables = { name: focusedMicroAppHeaders.name };
      // delay the first call to check if the user is logged in; if the user is logged in, do not make first call
      if (microAppDataCalled || shouldFetchMicroApps) {
        loadAppData({ variables: { name: focusedMicroAppHeaders.name } });
        if (shouldFetchMicroApps) dispatch(setShouldFetchMicroApps(false));
      } else {
        const timeout = setTimeout(() => {
          if (!isLoggedIn) loadAppData({ variables });
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [
    dispatch,
    loadAppData,
    focusedMicroAppHeaders,
    microAppDataCalled,
    isLoggedIn,
    shouldFetchMicroApps,
  ]);

  // write micro apps headers into async storage
  useEffect(() => {
    if (typeof microAppsHeaders !== 'undefined') {
      try {
        const microAppsHeadersObject: Record<string, MicroAppHeaders> = {};
        (microAppsHeaders.microApps as Array<MicroAppHeaders>).forEach(
          (item) => (microAppsHeadersObject[item.name] = item),
        );
        AsyncStorage.setItem(
          'microAppsHeaders',
          JSON.stringify(microAppsHeadersObject),
        ).then();
      } catch (error) {
        console.log(error);
      }
    }
  }, [microAppsHeaders]);

  // destructure micro app data, and put into redux store
  useEffect(() => {
    if (typeof microAppData !== 'undefined') {
      const microApp = microAppData.microApp as MicroApp;
      // if null, escape function execution
      if (!microApp?.data) return;

      const { controlEntities, setups, makerConfig } = JSON.parse(
        microApp.data,
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
