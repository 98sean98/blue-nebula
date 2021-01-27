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
import { BleManager } from 'react-native-ble-plx';

import { BluetoothConstants } from '../constants';
import {
  ConnectAsyncBluetoothAction,
  setIsScanningConnecting,
} from '../actions';

import { RootState } from '@reduxApp/rootReducer';

import { bleScan } from './bleScan';
import { bleConnect } from './bleConnect';

function* connectAsync({}: ConnectAsyncBluetoothAction): Generator<
  StrictEffect,
  void
> {
  const bleManager = yield select(
    (state: RootState) => state.bluetooth.bleManager,
  );

  yield put(setIsScanningConnecting(true));

  const raceResults = yield race({
    deviceId: call(bleScan, bleManager as BleManager),
    cancel: take(BluetoothConstants.CANCEL_CONNECT),
  });

  const { deviceId } = raceResults as { deviceId: string | undefined };

  console.log('connect async found device id:', deviceId);

  if (!deviceId) {
    console.log('device could not be found!');
    yield put(setIsScanningConnecting(false));
    return;
  }

  yield call(bleConnect, bleManager as BleManager, deviceId);

  // yield put()

  yield put(setIsScanningConnecting(false));
}

function* watchConnectAsync() {
  yield takeLatest(BluetoothConstants.CONNECT_ASYNC, connectAsync);
}

export function* bluetoothSagas() {
  yield all([fork(watchConnectAsync)]);
}
