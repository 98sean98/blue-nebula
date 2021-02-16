import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@reduxApp';
import {
  startMonitoringConnectionAsync,
  stopMonitoringConnection,
} from '@reduxApp/bluetooth/actions';

export const SettingsLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const {
    isScanningAndConnecting,
    isMonitoringBleRpiDeviceConnection,
  } = useSelector((state: RootState) => state.bluetooth);

  const { shouldMonitorDeviceConnection } = useSelector(
    (state: RootState) => state.settings,
  );

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
