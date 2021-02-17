import React, { FC, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';

export const ControlEntitiesLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const readStorage = async () => {
      const json = await AsyncStorage.getItem('controlEntities');
      if (json !== null) {
        console.log('successfully read control entities data from storage!');
        dispatch(setControlEntities(JSON.parse(json)));
      }
    };

    try {
      readStorage().then();
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Read Storage Error',
        'There was an error retrieving app control entities data from your phone storage.',
      );
    }
  }, [dispatch]);

  const { controlEntities } = useSelector((state: RootState) => state.control);

  useEffect(() => {
    const writeStorage = async () => {
      const newJson = JSON.stringify(controlEntities);
      await AsyncStorage.setItem('controlEntities', newJson);
    };
    try {
      // artificially delay updates to async storage by 500ms to avoid writing empty state on initial load
      const timeout = setTimeout(() => {
        writeStorage().then();
        console.log(
          'successfully wrote app control entities data into storage!',
        );
      }, 500);
      return () => clearTimeout(timeout);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Write Storage Error',
        'There was an error writing app control entities data into your phone storage.',
      );
    }
  }, [controlEntities]);

  return <>{children}</>;
};
