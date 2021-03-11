import { ApplicationError, ApplicationMode } from '@models/application';

// types and interfaces for feature
export type Settings = {
  shouldMonitorDeviceConnection: boolean;
};

// action payload
export type SetIsLoading = boolean;

export type SetApplicationError = ApplicationError | undefined;

export type SetApplicationMode = ApplicationMode;

// feature state
export type ApplicationState = {
  readonly isLoading: boolean;
  readonly applicationError: ApplicationError | undefined;
  readonly applicationMode: ApplicationMode;
};
