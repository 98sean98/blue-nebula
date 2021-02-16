import { fork, takeLatest, take, cancel } from 'redux-saga/effects';

import { BluetoothConstants } from '../constants';

import { connectAsyncSaga } from './connectAsyncSaga';
import { monitorConnection } from './monitorConnection';

function* watchConnectAsync() {
  yield takeLatest(BluetoothConstants.CONNECT_ASYNC, connectAsyncSaga);
}

function* watchMonitorConnection() {
  while (yield take(BluetoothConstants.START_MONITORING_CONNECTION_ASYNC)) {
    // starts the task in the background
    const monitor = yield fork(monitorConnection);

    // wait for a stop action
    yield take(BluetoothConstants.STOP_MONITORING_CONNECTION);
    // cancel the monitor task, and cause the task to jump into its finally block
    yield cancel(monitor);
  }
}

export function* bluetoothSagas() {
  yield fork(watchConnectAsync);
  yield fork(watchMonitorConnection);
}
