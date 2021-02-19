import { BuilderConstants } from './constants';

import { RemoveSetup, SetSetups } from './types';

export const setSetups = (
  payload: SetSetups, // required action arg
) =>
  ({
    type: BuilderConstants.SET_SETUPS,
    payload,
  } as const);

export const removeSetup = (
  payload: RemoveSetup, // required action arg
) =>
  ({
    type: BuilderConstants.REMOVE_SETUP,
    payload,
  } as const);

/**
 * @description union of all the actions by using ReturnType to get the return type of each function
 * @guide https://www.carlrippon.com/managing-app-state-with-redux-and-typescript-p1/
 */
export type SetSetupsBuilderAction = ReturnType<typeof setSetups>;
export type RemoveSetupBuilderAction = ReturnType<typeof removeSetup>;

export type BuilderActionTypes =
  | SetSetupsBuilderAction
  | RemoveSetupBuilderAction;
