import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { BleManager } from 'react-native-ble-plx';

import { setBleManager, setBleManagerState } from '@reduxApp/bluetooth/actions';

export const BleLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const bleManager = useMemo(() => new BleManager(), []);

  useEffect(() => {
    dispatch(setBleManager(bleManager));
  }, [dispatch, bleManager]);

  useEffect(() => {
    const subscription = bleManager.onStateChange((newState) => {
      dispatch(setBleManagerState(newState));
    });
    return () => subscription.remove();
  }, [dispatch, bleManager]);

  return <>{children}</>;
};
