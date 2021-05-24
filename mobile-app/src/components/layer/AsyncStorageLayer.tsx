import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { capitalCase } from 'change-case';

import { RootState } from '@reduxApp';
import { setAuthorizationToken } from '@reduxApp/auth/actions';
import {
  setApplicationAlert,
  setFocusedMicroAppHeaders,
  setShouldForceMicroAppUpdate,
} from '@reduxApp/application/actions';
import {
  SetFocusedMicroAppHeaders,
  SetShouldForceMicroAppUpdate,
} from '@reduxApp/application/types';
import { setControlEntities } from '@reduxApp/control/actions';
import { SetControlEntities } from '@reduxApp/control/types';
import { setMakerConfig, setSetups } from '@reduxApp/builder/actions';
import { SetMakerConfig, SetSetups } from '@reduxApp/builder/types';

import {
  ConvertibleState,
  convertStateWithTimestamps,
} from '@utilities/functions/object-convert/convertStateWithTimestamps';
import {
  ConvertibleObject,
  convertObjectWithTimestampKeys,
} from '@utilities/functions/object-convert/convertObjectWithTimestampKeys';

export const AsyncStorageLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const { authorizationToken } = useSelector((state: RootState) => state.auth);
  const { focusedMicroAppHeaders, shouldForceMicroAppUpdate } = useSelector(
    (state: RootState) => state.application,
  );
  const { controlEntities } = useSelector((state: RootState) => state.control);
  const { setups, makerConfig } = useSelector(
    (state: RootState) => state.builder,
  );

  const renderAlert = useCallback(
    (type: 'reading' | 'writing') =>
      dispatch(
        setApplicationAlert({
          title: `${capitalCase(type)} Storage Error`,
          message: `There was an error ${type} app data into your phone storage. Please close and open this app again.`,
        }),
      ),
    [dispatch],
  );

  const readStorage = useCallback(
    async (storageKey: string): Promise<unknown> => {
      const json = await AsyncStorage.getItem(storageKey);
      if (json !== null) {
        console.log(`successfully read ${storageKey} data from storage!`);
        return JSON.parse(json);
      }
      return {};
    },
    [],
  );

  // --- read storage on first render ---
  useEffect(() => {
    try {
      readStorage('authorizationToken').then((state) => {
        if (typeof state !== 'undefined')
          dispatch(
            setAuthorizationToken(
              (state as { authorizationToken: string }).authorizationToken,
            ),
          );
      });
      readStorage('application').then((state) => {
        if (typeof state !== 'undefined') {
          if (typeof (state as any).focusedMicroAppHeaders !== 'undefined')
            dispatch(
              setFocusedMicroAppHeaders(
                (state as { focusedMicroAppHeaders: SetFocusedMicroAppHeaders })
                  .focusedMicroAppHeaders,
              ),
            );
          if (typeof (state as any).shouldForceMicroAppUpdate !== 'undefined')
            dispatch(
              setShouldForceMicroAppUpdate(
                (state as {
                  shouldForceMicroAppUpdate: SetShouldForceMicroAppUpdate;
                }).shouldForceMicroAppUpdate,
              ),
            );
        }
      });
      readStorage('controlEntities').then((state) => {
        if (typeof state !== 'undefined')
          dispatch(setControlEntities(state as SetControlEntities));
      });
      readStorage('setups').then((state) => {
        if (typeof state !== 'undefined') {
          const stateWithConvertedTimestamps = convertStateWithTimestamps(
            state as ConvertibleState,
            ['createdAt', 'updatedAt'],
          );
          dispatch(setSetups(stateWithConvertedTimestamps as SetSetups));
        }
      });
      readStorage('makerConfig').then((state) => {
        if (typeof state !== 'undefined') {
          const stateWithConvertedTimestamps = convertObjectWithTimestampKeys(
            state as ConvertibleObject,
            ['updatedAt'],
          );
          dispatch(
            setMakerConfig(stateWithConvertedTimestamps as SetMakerConfig),
          );
        }
      });
    } catch (error) {
      console.log(error);
      renderAlert('reading');
    }
  }, [dispatch, renderAlert, readStorage]);

  const writeStorage = useCallback(
    async (storageKey: string, storageValue: unknown) => {
      const newJson = JSON.stringify(storageValue);
      await AsyncStorage.setItem(storageKey, newJson);
    },
    [],
  );

  // --- write authorization token when it is updated ---
  useEffect(() => {
    try {
      // artificially delay updates to async storage by 500ms to avoid writing empty state on initial load
      const timeout = setTimeout(() => {
        const state = { authorizationToken };
        writeStorage('authorizationToken', state).then();
        console.log(
          'successfully wrote app authorization token data into storage!',
        );
      }, 500);
      return () => clearTimeout(timeout);
    } catch (error) {
      console.log(error);
      renderAlert('writing');
    }
  }, [writeStorage, renderAlert, authorizationToken]);

  // --- write application data when it is updated ---
  useEffect(() => {
    try {
      // artificially delay updates to async storage by 500ms to avoid writing empty state on initial load
      const timeout = setTimeout(() => {
        const state = { focusedMicroAppHeaders, shouldForceMicroAppUpdate };
        writeStorage('application', state).then();
        console.log('successfully wrote app application data into storage!');
      }, 500);
      return () => clearTimeout(timeout);
    } catch (error) {
      console.log(error);
      renderAlert('writing');
    }
  }, [
    writeStorage,
    renderAlert,
    focusedMicroAppHeaders,
    shouldForceMicroAppUpdate,
  ]);

  // --- write control entities data when it is updated ---
  useEffect(() => {
    try {
      // artificially delay updates to async storage by 500ms to avoid writing empty state on initial load
      const timeout = setTimeout(() => {
        writeStorage('controlEntities', controlEntities).then();
        console.log(
          'successfully wrote app control entities data into storage!',
        );
      }, 500);
      return () => clearTimeout(timeout);
    } catch (error) {
      console.log(error);
      renderAlert('writing');
    }
  }, [writeStorage, renderAlert, controlEntities]);

  // --- write setups data when it is updated ---
  useEffect(() => {
    try {
      // artificially delay updates to async storage by 500ms to avoid writing empty state on initial load
      const timeout = setTimeout(() => {
        writeStorage('setups', setups).then();
        console.log('successfully wrote app setups data into storage!');
      }, 500);
      return () => clearTimeout(timeout);
    } catch (error) {
      console.log(error);
      renderAlert('writing');
    }
  }, [writeStorage, renderAlert, setups]);

  // --- write setups data when it is updated ---
  useEffect(() => {
    try {
      // artificially delay updates to async storage by 500ms to avoid writing empty state on initial load
      const timeout = setTimeout(() => {
        writeStorage('makerConfig', makerConfig).then();
        console.log('successfully wrote app makerConfig data into storage!');
      }, 500);
      return () => clearTimeout(timeout);
    } catch (error) {
      console.log(error);
      renderAlert('writing');
    }
  }, [writeStorage, renderAlert, makerConfig]);

  return <>{children}</>;
};
