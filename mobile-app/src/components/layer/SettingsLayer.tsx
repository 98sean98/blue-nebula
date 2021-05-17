import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import { RootState } from '@reduxApp';
import { setSettings } from '@reduxApp/settings/actions';
import {
  startMonitoringConnectionAsync,
  stopMonitoringConnection,
} from '@reduxApp/bluetooth/actions';
import { setApplicationAlert } from '@reduxApp/application/actions';

import { getDeviceLanguage } from '@utilities/functions/ux';

export const SettingsLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const readStorage = async () => {
      const json = await AsyncStorage.getItem('settings');
      if (json !== null) {
        console.log('successfully read settings data from storage!');
        dispatch(setSettings(JSON.parse(json)));
      }
    };

    try {
      readStorage().then();
    } catch (error) {
      console.log(error);
      dispatch(
        setApplicationAlert({
          title: 'Read Storage Error',
          message:
            'There was an error retrieving app settings data from your phone storage.',
        }),
      );
    }
  }, [dispatch]);

  const { shouldMonitorDeviceConnection, language } = useSelector(
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

  const { i18n } = useTranslation();

  useEffect(() => {
    const newLanguage =
      typeof language !== 'undefined' ? language : getDeviceLanguage();
    if (newLanguage !== i18n.language) i18n.changeLanguage(newLanguage).then();
  }, [language, i18n]);

  return <>{children}</>;
};
