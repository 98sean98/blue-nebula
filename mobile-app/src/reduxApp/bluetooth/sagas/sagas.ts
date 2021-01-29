import { all, fork, takeLatest } from 'redux-saga/effects';

import { BluetoothConstants } from '../constants';

import { connectAsyncSaga } from './connectAsyncSaga';

function* watchConnectAsync() {
  yield takeLatest(BluetoothConstants.CONNECT_ASYNC, connectAsyncSaga);
}

export function* bluetoothSagas() {
  yield all([fork(watchConnectAsync)]);
}
