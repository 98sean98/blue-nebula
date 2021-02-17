import deepmerge from 'deepmerge';

import { ControlConstants } from './constants';
import { ControlState } from './types';
import { ControlActionTypes } from './actions';

import {
  ControlEntities,
  declaredControlEntities,
} from '@models/control-entity/ControlEntities';

const initialState: ControlState = {
  controlEntities: declaredControlEntities,
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
    default:
      // saga actions would just return the state
      return state;
  }
};
