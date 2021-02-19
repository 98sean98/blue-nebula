import React, { FC, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { capitalCase } from 'change-case';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';
import { setSetups } from '@src/reduxApp/builder/actions';
import { SetControlEntities } from '@reduxApp/control/types';
import { SetSetups } from '@reduxApp/builder/types';

const renderAlert = (type: 'reading' | 'writing') =>
  Alert.alert(
    `${capitalCase(type)} Storage Error`,
    `There was an error ${type} app data into your phone storage.`,
  );

export const AsyncStorageLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const { controlEntities } = useSelector((state: RootState) => state.control);
  const { setups } = useSelector((state: RootState) => state.builder);

  const readStorage = useCallback(async (storageKey: string): Promise<
    unknown
  > => {
    const json = await AsyncStorage.getItem(storageKey);
    if (json !== null) {
      console.log(`successfully read ${storageKey} data from storage!`);
      return JSON.parse(json);
    }
  }, []);

  useEffect(() => {
    try {
      readStorage('controlEntities').then((state) =>
        dispatch(setControlEntities(state as SetControlEntities)),
      );
      readStorage('setups').then((state) =>
        dispatch(setSetups(state as SetSetups)),
      );
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

  return <>{children}</>;
};
