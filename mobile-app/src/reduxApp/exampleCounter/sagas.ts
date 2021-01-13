import {
  StrictEffect,
  all,
  put,
  delay,
  fork,
  takeEvery,
} from 'redux-saga/effects';

import { ExampleCounterConstants } from './constants';
import {
  IncrementAsyncExampleCounterAction,
  incrementExampleCounter,
} from './actions';

function* incrementAsync({
  payload,
}: IncrementAsyncExampleCounterAction): Generator<StrictEffect, void> {
  yield delay(payload.delay || 1000);
  yield put(incrementExampleCounter(payload.incrementBy));
}

function* watchIncrementAsync() {
  yield takeEvery(ExampleCounterConstants.INCREMENT_ASYNC, incrementAsync);
}

export function* exampleCounterSagas() {
  yield all([fork(watchIncrementAsync)]);
}
