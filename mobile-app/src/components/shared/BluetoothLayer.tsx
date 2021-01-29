import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { BleManager } from 'react-native-ble-plx';

import { setBleManager, setBleManagerState } from '@reduxApp/bluetooth/actions';

export const BluetoothLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const bleManager = useMemo(() => new BleManager(), []);

  useEffect(() => {
    dispatch(setBleManager(bleManager));
  }, [dispatch, bleManager]);

  useEffect(() => {
    bleManager.onStateChange((newState) => {
      dispatch(setBleManagerState(newState));
    });
  }, [dispatch, bleManager]);

  return <>{children}</>;
};
