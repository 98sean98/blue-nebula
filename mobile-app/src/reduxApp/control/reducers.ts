import deepmerge from 'deepmerge';

import { ControlConstants } from './constants';
import { ControlState } from './types';
import { ControlActionTypes } from './actions';

import { ControlEntities } from '@models/control-entity/ControlEntities';

const initialState: ControlState = {
  controlEntities: {},
};

export const controlReducer = (
  state = initialState,
  action: ControlActionTypes,
): ControlState => {
  switch (action.type) {
    case ControlConstants.SET_CONTROL_ENTITIES:
      return {
        ...state,
        controlEntities: deepmerge(
          state.controlEntities,
          action.payload,
        ) as ControlEntities,
      };
    case ControlConstants.REMOVE_CONTROL_ENTITY:
      const key = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...controlEntities } = state.controlEntities;
      return {
        ...state,
        controlEntities,
      };
    case ControlConstants.CLEAR_ALL_CONTROL_ENTITIES:
      return { ...state, controlEntities: {} };
    default:
      // saga actions would just return the state
      return state;
  }
};
