import { DeepPartial } from 'redux';
import { ControlEntities } from '@models/ControlEntities';

// types and interfaces for feature

// action payload
export type SetControlEntities = DeepPartial<ControlEntities>;

// feature state
export type ControlState = {
  readonly controlEntities: ControlEntities;
};
