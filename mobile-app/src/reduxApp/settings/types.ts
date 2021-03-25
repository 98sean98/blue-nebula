import { PartialDeep } from 'type-fest';

import { Language } from '@config/localisation/Language';

// types and interfaces for feature
export type Settings = {
  shouldMonitorDeviceConnection: boolean;
  language: Language | undefined;
};

// action payload
export type SetSettings = PartialDeep<Settings>;

// feature state
export type SettingsState = Settings;
