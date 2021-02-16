import {
  call,
  put,
  race,
  select,
  StrictEffect,
  take,
} from '@redux-saga/core/effects';
import { BleManager, Device } from 'react-native-ble-plx';

import {
  cancelConnect,
  ConnectAsyncBluetoothAction,
  setBleRpiDeviceServicesCharacteristics,
  setIsBleRpiDeviceConnected,
  setIsScanningConnecting,
  startMonitoringConnectionAsync,
} from '../actions';
import { SetBleRpiDeviceServicesCharacteristics } from '../types';
import { BluetoothConstants } from '../constants';

import { RootState } from '@reduxApp/rootReducer';

import { bleScan } from './bleScan';
import { bleConnect } from './bleConnect';
import { bleGetServicesAndCharacteristics } from './bleGetServicesAndCharacteristics';

export function* connectAsyncSaga({}: ConnectAsyncBluetoothAction): Generator<
  StrictEffect,
  void
> {
  const bleManager = yield select(
    (state: RootState) => state.bluetooth.bleManager,
  );

  yield put(setIsScanningConnecting(true));

  // setup a race, so that continuous scanning can be cancelled by a CANCEL_CONNECT action anytime
  const raceResults = yield race({
    deviceId: call(bleScan, bleManager as BleManager),
    cancel: take(BluetoothConstants.CANCEL_CONNECT),
  });

  // obtain device id
  const { deviceId } = raceResults as { deviceId: string | undefined };

  // if device could not be found
  if (!deviceId) {
    console.log('device could not be found!');
    yield put(setIsScanningConnecting(false));
    return;
  }

  try {
    console.log('connecting to device...');

    // connect to device, and obtain the connected device
    const connectedDevice = yield call(
      bleConnect,
      bleManager as BleManager,
      deviceId,
    );

    console.log('successfully connected to device!');

    try {
      console.log('getting services and characteristics...');

      // get services and characteristics
      const bleRpiDeviceServicesCharacteristics = yield call(
        bleGetServicesAndCharacteristics,
        connectedDevice as Device,
      );

      console.log('obtained services and characteristics!');

      // up to this point, the device is successfully connected, with the correct services and characteristics according to RpiDevice config
      // store device, services, and characteristics into redux
      yield put(
        setBleRpiDeviceServicesCharacteristics(
          bleRpiDeviceServicesCharacteristics as SetBleRpiDeviceServicesCharacteristics,
        ),
      );
      // mark BleRpiDevice as connected
      yield put(setIsBleRpiDeviceConnected(true));

      // if should monitor device connection is true in settings, try to start monitoring
      try {
        const shouldMonitorDeviceConnection = yield select(
          (state: RootState) => state.settings.shouldMonitorDeviceConnection,
        );
        if (shouldMonitorDeviceConnection)
          yield put(startMonitoringConnectionAsync());
      } catch (e) {
        console.log(
          'error starting to monitor device connection after device has been connected successfully',
          e,
        );
      }
    } catch (e) {
      yield put(setIsBleRpiDeviceConnected(false));
      yield put(cancelConnect());
      console.log('error getting services and characteristics:', e);
    }
  } catch (e) {
    yield put(setIsBleRpiDeviceConnected(false));
    yield put(cancelConnect());
    console.log('error connecting to device:', e);
  } finally {
    // in any case, scanning and connecting action is stopped
    yield put(setIsScanningConnecting(false));
  }
}
