import { createContext, Dispatch, SetStateAction } from 'react';

import { ActionNode } from '@models/app-maker';

export type ChartingActions = {
  isCompleted: boolean;
  currentlyCharting: ActionNode;
  // goToNext: () => void;
};

type AppMakerContext = {
  shouldExpandConfigView: boolean;
  setShouldExpandConfigView: Dispatch<SetStateAction<boolean>>;
  focusedPageIndex: number;
  setFocusedPageIndex: Dispatch<SetStateAction<number>>;
  createNewPage: (pageIndex: number, goToLastPage?: boolean) => void;
  chartingActions: ChartingActions;
};

export const initialAppMakerContext: AppMakerContext = {
  shouldExpandConfigView: false,
  setShouldExpandConfigView: () => {},
  focusedPageIndex: 0,
  setFocusedPageIndex: () => {},
  createNewPage: () => {},
  chartingActions: {
    isCompleted: false,
    currentlyCharting: { boxKey: '0' },
  },
};

export const AppMakerContext = createContext<AppMakerContext>(
  initialAppMakerContext,
);
