import {
  ApplicationError,
  ApplicationMode,
  MicroAppHeaders,
} from '@models/application';

// types and interfaces for feature
export type Settings = {
  shouldMonitorDeviceConnection: boolean;
};

// action payload
export type SetIsLoading = boolean;

export type SetApplicationError = ApplicationError | undefined;

export type SetApplicationMode = ApplicationMode;

export type SetFocusedMicroAppHeaders = MicroAppHeaders;

// feature state
export type ApplicationState = {
  readonly isLoading: boolean;
  readonly applicationError: ApplicationError | undefined;
  readonly applicationMode: ApplicationMode;
  readonly focusedMicroAppHeaders: MicroAppHeaders | undefined;
};
