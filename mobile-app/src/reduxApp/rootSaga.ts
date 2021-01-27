import { all, fork } from 'redux-saga/effects';

import { exampleCounterSagas } from './exampleCounter';
import { bluetoothSagas } from './bluetooth';

export function* rootSaga() {
  yield all([fork(exampleCounterSagas)]);
  yield all([fork(bluetoothSagas)]);
}
