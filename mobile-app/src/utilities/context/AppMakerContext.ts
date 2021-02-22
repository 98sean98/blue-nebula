import { createContext, Dispatch, SetStateAction } from 'react';

import { MakerConfig } from '@models/app-maker';

type AppMakerContext = {
  config: MakerConfig;
  setConfig: Dispatch<SetStateAction<MakerConfig>>;
  shouldExpandConfigView: boolean;
  setShouldExpandConfigView: Dispatch<SetStateAction<boolean>>;
};

export const initialAppMakerContext: AppMakerContext = {
  config: { pages: {} },
  setConfig: () => {},
  shouldExpandConfigView: false,
  setShouldExpandConfigView: () => {},
};

export const AppMakerContext = createContext<AppMakerContext>(
  initialAppMakerContext,
);
