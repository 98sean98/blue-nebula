import { ApplicationConstants } from './constants';

import {
  SetApplicationAlert,
  SetApplicationMode,
  SetFocusedMicroAppHeaders,
  SetIsLoading,
  SetShouldFetchMicroApp,
  SetShouldForceMicroAppUpdate,
} from './types';

export const setIsLoading = (
  payload: SetIsLoading, // required action arg
) =>
  ({
    type: ApplicationConstants.SET_IS_LOADING,
    payload,
  } as const);

export const setApplicationAlert = (
  payload: SetApplicationAlert, // required action arg
) =>
  ({
    type: ApplicationConstants.SET_APPLICATION_ALERT,
    payload: payload && {
      isError: payload.isError ?? true, // all alerts are errors unless specified otherwise
      ...payload,
    },
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

export const setShouldForceMicroAppUpdate = (
  payload: SetShouldForceMicroAppUpdate, // required action arg
) =>
  ({
    type: ApplicationConstants.SET_SHOULD_FORCE_MICRO_APP_UPDATE,
    payload,
  } as const);

/**
 * @description union of all the actions by using ReturnType to get the return type of each function
 * @guide https://www.carlrippon.com/managing-app-state-with-redux-and-typescript-p1/
 */
export type SetIsLoadingApplicationAction = ReturnType<typeof setIsLoading>;
export type SetApplicationAlertApplicationAction = ReturnType<
  typeof setApplicationAlert
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
export type SetShouldForceMicroAppUpdateApplicationAction = ReturnType<
  typeof setShouldForceMicroAppUpdate
>;

export type ApplicationActionTypes =
  | SetIsLoadingApplicationAction
  | SetApplicationAlertApplicationAction
  | SetApplicationModeApplicationAction
  | SetFocusedMicroAppHeadersApplicationAction
  | SetShouldFetchMicroAppApplicationAction
  | SetShouldForceMicroAppUpdateApplicationAction;
