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

import { isAuthenticated, login, logout } from '@api/auth';

import { RootState } from '@reduxApp';
import {
  setApplicationError,
  setIsLoading,
} from '@reduxApp/application/actions';

function* loginAsync({
  payload,
}: LoginAsyncAuthAction): Generator<StrictEffect, void> {
  try {
    // set application loading state
    yield put(setIsLoading(true));

    // call login api to obtain a token
    const token = yield call(login, payload);
    yield put(setAuthorizationToken(token as string));

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

    // if token does not exist, throw error
    if (typeof token === 'undefined') throw new Error('token does not exist');

    // call logout api
    yield call(logout, token as string);

    // remove authentication token
    yield put(setAuthorizationToken(undefined));

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

function* checkIsAuthenticatedAsync(): Generator<StrictEffect, void> {
  try {
    // get token from store
    const token = yield select(
      (state: RootState) => state.auth.authorizationToken,
    );

    // call is authenticated api if token exists
    if (typeof token !== 'undefined')
      yield call(isAuthenticated, token as string);
  } catch (e) {
    console.log('failed checking is authenticated:', e);

    // remove authentication token
    yield put(setAuthorizationToken(undefined));
  }
}

function* watchLoginAsync() {
  yield takeEvery(AuthConstants.LOGIN_ASYNC, loginAsync);
}

function* watchLogoutAsync() {
  yield takeEvery(AuthConstants.LOGOUT_ASYNC, logoutAsync);
}

function* watchCheckIsAuthenticatedAsync() {
  yield takeEvery(
    AuthConstants.CHECK_IS_AUTHENTICATED_ASYNC,
    checkIsAuthenticatedAsync,
  );
}

export function* authSagas() {
  yield all([fork(watchLoginAsync)]);
  yield all([fork(watchLogoutAsync)]);
  yield all([fork(watchCheckIsAuthenticatedAsync)]);
}
