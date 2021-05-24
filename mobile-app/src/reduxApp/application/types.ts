import {
  ApplicationAlert,
  ApplicationMode,
  MicroAppHeaders,
} from '@models/application';

// types and interfaces for feature

// action payload
export type SetIsLoading = boolean;

export type SetApplicationAlert = ApplicationAlert | undefined;

export type SetApplicationMode = ApplicationMode;

export type SetFocusedMicroAppHeaders = MicroAppHeaders;

export type SetShouldFetchMicroApp = boolean;

export type SetShouldForceMicroAppUpdate = boolean;

// feature state
export type ApplicationState = {
  readonly isLoading: boolean;
  readonly applicationAlert: ApplicationAlert | undefined;
  readonly applicationMode: ApplicationMode;
  readonly focusedMicroAppHeaders: MicroAppHeaders | undefined;
  readonly shouldFetchMicroApp: boolean;
  readonly shouldForceMicroAppUpdate: boolean;
};
