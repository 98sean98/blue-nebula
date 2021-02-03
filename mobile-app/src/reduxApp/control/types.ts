import { DeepPartial } from 'redux';
import { DeclaredControlEntities } from '@config/declaredControlEntities';

// types and interfaces for feature

// action payload
export type SetControlEntities = DeepPartial<DeclaredControlEntities>;

// feature state
export type ControlState = {
  readonly controlEntities: DeclaredControlEntities;
};
