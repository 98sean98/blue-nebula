import { ApplicationConstants } from './constants';
import { ApplicationState } from './types';
import { ApplicationActionTypes } from './actions';

import { ApplicationMode } from '@models/application';

const initialState: ApplicationState = {
  isLoading: false,
  applicationError: undefined,
  applicationMode: ApplicationMode.NORMAL,
};

export const applicationReducer = (
  state = initialState,
  action: ApplicationActionTypes,
): ApplicationState => {
  switch (action.type) {
    case ApplicationConstants.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case ApplicationConstants.SET_APPLICATION_ERROR:
      return { ...state, applicationError: action.payload };
    case ApplicationConstants.SET_APPLICATION_MODE:
      return { ...state, applicationMode: action.payload };
    default:
      // saga actions would just return the state
      return state;
  }
};
