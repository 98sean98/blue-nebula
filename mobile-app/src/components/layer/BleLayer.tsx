import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BleManager, State } from 'react-native-ble-plx';
import { useTranslation } from 'react-i18next';

import { RootState } from '@reduxApp';
import { setBleManager, setBleManagerState } from '@reduxApp/bluetooth/actions';

export const BleLayer: FC = ({ children }) => {
  const { t } = useTranslation('bluetooth');

  const dispatch = useDispatch();

  const { bleManagerState } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  const bleManager = useMemo(() => new BleManager(), []);

  const handleState = useCallback(
    (state: State) => {
      dispatch(setBleManagerState(state));
      if (state !== State.PoweredOn && bleManagerState !== state)
        Alert.alert(
          t('connection.bluetooth not available'),
          t('connection.turn on bluetooth'),
        );
    },
    [dispatch, t, bleManagerState],
  );

  useEffect(() => {
    dispatch(setBleManager(bleManager));
  }, [dispatch, bleManager]);

  useEffect(() => {
    bleManager.state().then((newState) => handleState(newState));
  }, [bleManager, handleState]);

  useEffect(() => {
    const subscription = bleManager.onStateChange((newState) =>
      handleState(newState),
    );
    return () => subscription.remove();
  }, [bleManager, handleState]);

  return <>{children}</>;
};
