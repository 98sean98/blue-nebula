import { Setups } from '@models/setup';

// types and interfaces for feature

// action payload
export type SetSetups = Setups;

export type RemoveSetup = string; // setup key

// feature state
export type BuilderState = {
  readonly setups: Setups;
};
