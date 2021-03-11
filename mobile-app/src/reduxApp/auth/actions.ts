import { AuthConstants } from './constants';

import { SetAuthorizationToken, SetUser, LoginAsync } from './types';

export const setAuthorizationToken = (
  payload: SetAuthorizationToken, // required action arg
) =>
  ({
    type: AuthConstants.SET_AUTHORIZATION_TOKEN,
    payload,
  } as const);

export const setUser = (
  payload: SetUser, // optional action arg
) =>
  ({
    type: AuthConstants.SET_USER,
    payload,
  } as const);

export const loginAsync = (payload: LoginAsync) =>
  ({
    type: AuthConstants.LOGIN,
    payload,
  } as const);

/**
 * @description union of all the actions by using ReturnType to get the return type of each function
 * @guide https://www.carlrippon.com/managing-app-state-with-redux-and-typescript-p1/
 */
export type SetAuthorizationTokenAuthAction = ReturnType<
  typeof setAuthorizationToken
>;

export type SetUserAuthAction = ReturnType<typeof setUser>;

export type LoginAsyncAuthAction = ReturnType<typeof loginAsync>;

export type AuthActionTypes =
  | SetAuthorizationTokenAuthAction
  | SetUserAuthAction
  | LoginAsyncAuthAction;
