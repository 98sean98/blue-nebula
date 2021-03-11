import {
  all,
  call,
  fork,
  put,
  select,
  StrictEffect,
  takeEvery,
} from 'redux-saga/effects';

import { AuthConstants } from './constants';
import { LoginAsyncAuthAction, setAuthorizationToken } from './actions';

import { login, logout } from '@api/auth';

import { RootState } from '@reduxApp';
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

    console.log('user logged in!');
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

function* logoutAsync(): Generator<StrictEffect, void> {
  try {
    // set application loading state
    yield put(setIsLoading(true));

    // get token from store
    const token = yield select(
      (state: RootState) => state.auth.authorizationToken,
    );

    // call logout api
    yield call(logout, token as string);

    // remove authentication token
    yield put(setAuthorizationToken(undefined));

    // set application mode
    yield put(setApplicationMode(ApplicationMode.NORMAL));

    // set application loading state
    yield put(setIsLoading(false));

    console.log('user logged out!');
  } catch (e) {
    console.log('failed logout attempt:', e);

    // set application loading state
    yield put(setIsLoading(false));
    // set application error
    yield put(
      setApplicationError({
        title: 'Logout Error',
        message:
          'There was an error logging you out of the server. Please close the app, and restart.',
      }),
    );
  }
}

function* watchLoginAsync() {
  yield takeEvery(AuthConstants.LOGIN_ASYNC, loginAsync);
}

function* watchLogoutAsync() {
  yield takeEvery(AuthConstants.LOGOUT_ASYNC, logoutAsync);
}

export function* authSagas() {
  yield all([fork(watchLoginAsync)]);
  yield all([fork(watchLogoutAsync)]);
}
