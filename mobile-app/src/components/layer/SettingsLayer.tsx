import React, { FC, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootState } from '@reduxApp';
import { setSettings } from '@reduxApp/settings/actions';
import {
  startMonitoringConnectionAsync,
  stopMonitoringConnection,
} from '@reduxApp/bluetooth/actions';

export const SettingsLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const readStorage = async () => {
      const settingsJson = await AsyncStorage.getItem('settings');
      if (settingsJson !== null) {
        console.log('successfully read settings data from storage!');
        dispatch(setSettings(JSON.parse(settingsJson)));
      }
    };

    try {
      readStorage().then();
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Read Storage Error',
        'There was an error retrieving app settings data from your phone storage.',
      );
    }
  }, [dispatch]);

  const { shouldMonitorDeviceConnection } = useSelector(
    (state: RootState) => state.settings,
  );
  const {
    isScanningAndConnecting,
    isMonitoringBleRpiDeviceConnection,
  } = useSelector((state: RootState) => state.bluetooth);

  useEffect(() => {
    if (!isScanningAndConnecting)
      if (shouldMonitorDeviceConnection) {
        if (!isMonitoringBleRpiDeviceConnection) {
          console.log(
            'try to monitor connection, triggered by updates to settings!',
          );
          dispatch(startMonitoringConnectionAsync());
        }
      } else if (isMonitoringBleRpiDeviceConnection)
        dispatch(stopMonitoringConnection());
  }, [
    dispatch,
    shouldMonitorDeviceConnection,
    isScanningAndConnecting,
    isMonitoringBleRpiDeviceConnection,
  ]);

  return <>{children}</>;
};
