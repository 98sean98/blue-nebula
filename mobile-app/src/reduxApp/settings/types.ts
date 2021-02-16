import { PartialDeep } from 'type-fest';

// types and interfaces for feature
export type Settings = {
  shouldMonitorDeviceConnection: boolean;
};

// action payload
export type SetSettings = PartialDeep<Settings>;

// feature state
export type SettingsState = Settings;
