import { SettingsConstants } from './constants';

import { SetSettings } from './types';

export const setSettings = (
  payload: SetSettings, // required action arg
) =>
  ({
    type: SettingsConstants.SET_SETTINGS,
    payload,
  } as const);

/**
 * @description union of all the actions by using ReturnType to get the return type of each function
 * @guide https://www.carlrippon.com/managing-app-state-with-redux-and-typescript-p1/
 */
export type SetSettingsSettingsAction = ReturnType<typeof setSettings>;

export type SettingsActionTypes = SetSettingsSettingsAction;
