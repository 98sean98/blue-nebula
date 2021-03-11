import React, { FC, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { capitalCase } from 'change-case';

import { RootState } from '@reduxApp';
import { setAuthorizationToken } from '@reduxApp/auth/actions';
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

const renderAlert = (type: 'reading' | 'writing') =>
  Alert.alert(
    `${capitalCase(type)} Storage Error`,
    `There was an error ${type} app data into your phone storage. Please close and open this app again.`,
  );

export const AsyncStorageLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const { authorizationToken } = useSelector((state: RootState) => state.auth);
  const { controlEntities } = useSelector((state: RootState) => state.control);
  const { setups, makerConfig } = useSelector(
    (state: RootState) => state.builder,
  );

  const readStorage = useCallback(async (storageKey: string): Promise<
    unknown
  > => {
    const json = await AsyncStorage.getItem(storageKey);
    if (json !== null) {
      console.log(`successfully read ${storageKey} data from storage!`);
      return JSON.parse(json);
    }
    return {};
  }, []);

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
  }, [dispatch, readStorage]);

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
  }, [writeStorage, authorizationToken]);

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
  }, [writeStorage, controlEntities]);

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
  }, [writeStorage, setups]);

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
  }, [writeStorage, makerConfig]);

  return <>{children}</>;
};
