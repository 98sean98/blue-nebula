import { ApplicationConstants } from './constants';
import { ApplicationState } from './types';
import { ApplicationActionTypes } from './actions';

import { ApplicationMode } from '@models/application';

const initialState: ApplicationState = {
  isLoading: false,
  applicationError: undefined,
  applicationMode: ApplicationMode.NORMAL,
  // todo: set headers to undefined when first loaded screen showing a dropdown to choose a micro app is built
  focusedMicroAppHeaders: { id: 'some-id', name: 'scraper', activeVersion: 1 },
  shouldFetchMicroApps: false,
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
    case ApplicationConstants.SET_FOCUSED_MICRO_APP_HEADERS:
      return { ...state, focusedMicroAppHeaders: action.payload };
    case ApplicationConstants.SET_SHOULD_FETCH_MICRO_APPS:
      return { ...state, shouldFetchMicroApps: action.payload };
    default:
      // saga actions would just return the state
      return state;
  }
};
