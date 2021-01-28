import {
  all,
  call,
  fork,
  race,
  select,
  StrictEffect,
  take,
  takeLatest,
  put,
} from 'redux-saga/effects';
import { BleManager, Device } from 'react-native-ble-plx';

import { BluetoothConstants } from '../constants';
import {
  ConnectAsyncBluetoothAction,
  setBleRpiDeviceServicesCharacteristics,
  setIsBleRpiDeviceConnected,
  setIsScanningConnecting,
} from '../actions';
import { SetBleRpiDeviceServicesCharacteristics } from '../types';

import { RootState } from '@reduxApp/rootReducer';

import { bleScan } from './bleScan';
import { bleConnect } from './bleConnect';
import { bleGetServicesAndCharacteristics } from './bleGetServicesAndCharacteristics';

function* connectAsync({}: ConnectAsyncBluetoothAction): Generator<
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
    } catch (e) {
      yield put(setIsBleRpiDeviceConnected(false));
      console.log('error getting services and characteristics:', e);
    }
  } catch (e) {
    yield put(setIsBleRpiDeviceConnected(false));
    console.log('error connecting to device:', e);
  } finally {
    // in any case, scanning and connecting action is stopped
    yield put(setIsScanningConnecting(false));
  }
}

function* watchConnectAsync() {
  yield takeLatest(BluetoothConstants.CONNECT_ASYNC, connectAsync);
}

export function* bluetoothSagas() {
  yield all([fork(watchConnectAsync)]);
}
