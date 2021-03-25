import deepmerge from 'deepmerge';

import { SettingsConstants } from './constants';
import { SettingsState } from './types';
import { SettingsActionTypes } from './actions';

const initialState: SettingsState = {
  shouldMonitorDeviceConnection: false,
  language: undefined,
};

export const settingsReducer = (
  state = initialState,
  action: SettingsActionTypes,
): SettingsState => {
  switch (action.type) {
    case SettingsConstants.SET_SETTINGS:
      return deepmerge(state, action.payload);
    default:
      // saga actions would just return the state
      return state;
  }
};
