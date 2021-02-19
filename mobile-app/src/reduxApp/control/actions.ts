import { ControlConstants } from './constants';

import { RemoveControlEntity, SetControlEntities } from './types';

export const setControlEntities = (
  payload: SetControlEntities, // required action arg
) =>
  ({
    type: ControlConstants.SET_CONTROL_ENTITIES,
    payload,
  } as const);

export const removeControlEntity = (
  payload: RemoveControlEntity, // required action arg
) =>
  ({
    type: ControlConstants.REMOVE_CONTROL_ENTITY,
    payload,
  } as const);

/**
 * @description union of all the actions by using ReturnType to get the return type of each function
 * @guide https://www.carlrippon.com/managing-app-state-with-redux-and-typescript-p1/
 */
export type SetControlEntitiesControlAction = ReturnType<
  typeof setControlEntities
>;
export type RemoveControlEntityControlAction = ReturnType<
  typeof removeControlEntity
>;

export type ControlActionTypes =
  | SetControlEntitiesControlAction
  | RemoveControlEntityControlAction;
