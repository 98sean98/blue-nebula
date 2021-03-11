import {
  StrictEffect,
  all,
  call,
  fork,
  takeEvery,
  put,
} from 'redux-saga/effects';

import { AuthConstants } from './constants';
import { LoginAsyncAuthAction, setAuthorizationToken } from './actions';

import { login } from '@api/auth';

function* loginAsync({
  payload,
}: LoginAsyncAuthAction): Generator<StrictEffect, void> {
  try {
    const token = yield call(login, payload);
    yield put(setAuthorizationToken(token as string));
  } catch (e) {
    console.log('failed login attempt:', e);
  }
}

function* watchLoginAsync() {
  yield takeEvery(AuthConstants.LOGIN, loginAsync);
}

export function* authSagas() {
  yield all([fork(watchLoginAsync)]);
}
