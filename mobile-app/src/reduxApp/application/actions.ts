import { ApplicationConstants } from './constants';

import {
  SetApplicationError,
  SetApplicationMode,
  SetFocusedMicroAppHeaders,
  SetIsLoading,
  SetShouldFetchMicroApp,
} from './types';

export const setIsLoading = (
  payload: SetIsLoading, // required action arg
) =>
  ({
    type: ApplicationConstants.SET_IS_LOADING,
    payload,
  } as const);

export const setApplicationError = (
  payload: SetApplicationError, // required action arg
) =>
  ({
    type: ApplicationConstants.SET_APPLICATION_ERROR,
    payload,
  } as const);

export const setApplicationMode = (
  payload: SetApplicationMode, // required action arg
) =>
  ({
    type: ApplicationConstants.SET_APPLICATION_MODE,
    payload,
  } as const);

export const setFocusedMicroAppHeaders = (
  payload: SetFocusedMicroAppHeaders, // required action arg
) =>
  ({
    type: ApplicationConstants.SET_FOCUSED_MICRO_APP_HEADERS,
    payload,
  } as const);

export const setShouldFetchMicroApp = (
  payload: SetShouldFetchMicroApp, // required action arg
) =>
  ({
    type: ApplicationConstants.SET_SHOULD_FETCH_MICRO_APP,
    payload,
  } as const);

/**
 * @description union of all the actions by using ReturnType to get the return type of each function
 * @guide https://www.carlrippon.com/managing-app-state-with-redux-and-typescript-p1/
 */
export type SetIsLoadingApplicationAction = ReturnType<typeof setIsLoading>;
export type SetApplicationErrorApplicationAction = ReturnType<
  typeof setApplicationError
>;
export type SetApplicationModeApplicationAction = ReturnType<
  typeof setApplicationMode
>;
export type SetFocusedMicroAppHeadersApplicationAction = ReturnType<
  typeof setFocusedMicroAppHeaders
>;
export type SetShouldFetchMicroAppApplicationAction = ReturnType<
  typeof setShouldFetchMicroApp
>;

export type ApplicationActionTypes =
  | SetIsLoadingApplicationAction
  | SetApplicationErrorApplicationAction
  | SetApplicationModeApplicationAction
  | SetFocusedMicroAppHeadersApplicationAction
  | SetShouldFetchMicroAppApplicationAction;
