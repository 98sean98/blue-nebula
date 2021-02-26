import { BuilderConstants } from './constants';
import { BuilderState } from './types';
import { BuilderActionTypes } from './actions';

import { MakerConfig } from '@models/app-maker';

const initialState: BuilderState = {
  setups: {},
  makerConfig: {
    pages: {},
    actions: [],
  },
};

export const builderReducer = (
  state = initialState,
  action: BuilderActionTypes,
): BuilderState => {
  switch (action.type) {
    case BuilderConstants.SET_SETUPS:
      return {
        ...state,
        setups: {
          ...state.setups,
          ...action.payload,
        },
      };
    case BuilderConstants.REMOVE_SETUP:
      const key = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...setups } = state.setups;
      return {
        ...state,
        setups,
      };
    case BuilderConstants.SET_MAKER_CONFIG:
      return {
        ...state,
        makerConfig: {
          ...state.makerConfig,
          ...action.payload,
        } as MakerConfig,
      };
    default:
      // saga actions would just return the state
      return state;
  }
};
