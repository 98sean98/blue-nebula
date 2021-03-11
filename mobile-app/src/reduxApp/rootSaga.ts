import { all, fork } from 'redux-saga/effects';

import { authSagas } from './auth';
import { bluetoothSagas } from './bluetooth';
import { exampleCounterSagas } from './exampleCounter';

export function* rootSaga() {
  yield all([fork(authSagas)]);
  yield all([fork(bluetoothSagas)]);
  yield all([fork(exampleCounterSagas)]);
}
