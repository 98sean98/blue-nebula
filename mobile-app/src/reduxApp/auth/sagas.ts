import {
  all,
  call,
  fork,
  put,
  StrictEffect,
  takeEvery,
} from 'redux-saga/effects';

import { AuthConstants } from './constants';
import { LoginAsyncAuthAction, setAuthorizationToken } from './actions';

import { login } from '@api/auth';

import {
  setApplicationError,
  setApplicationMode,
  setIsLoading,
} from '@reduxApp/application/actions';

import { ApplicationMode } from '@models/application';

function* loginAsync({
  payload,
}: LoginAsyncAuthAction): Generator<StrictEffect, void> {
  try {
    // set application loading state
    yield put(setIsLoading(true));

    // call login api to obtain a token
    const token = yield call(login, payload);
    yield put(setAuthorizationToken(token as string));

    // set application mode
    yield put(setApplicationMode(ApplicationMode.GAME_MASTER));

    // set application loading state
    yield put(setIsLoading(false));
  } catch (e) {
    console.log('failed login attempt:', e);

    // set application loading state
    yield put(setIsLoading(false));
    // set application error
    yield put(
      setApplicationError({
        title: 'Login Error',
        message: 'There was an error logging you into the server.',
      }),
    );
  }
}

function* watchLoginAsync() {
  yield takeEvery(AuthConstants.LOGIN, loginAsync);
}

export function* authSagas() {
  yield all([fork(watchLoginAsync)]);
}
