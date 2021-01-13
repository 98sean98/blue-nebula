import { all, fork } from 'redux-saga/effects';

import { exampleCounterSagas } from './exampleCounter';

export function* rootSaga() {
  yield all([fork(exampleCounterSagas)]);
}
