import { createContext, Dispatch, SetStateAction } from 'react';

import { ActionNode, Actions } from '@models/app-maker';

export enum AppMakerMode {
  ContentBuilding = '@@AppMakerMode/ContentBuilding',
  ActionsCharting = '@@AppMakerMode/ActionsCharting',
}

export type ChartingActions = {
  isCompleted: boolean;
  cachedActionTree: Actions;
  currentlyCharting?: ActionNode;
};

type AppMakerContext = {
  mode: AppMakerMode;
  setMode: Dispatch<SetStateAction<AppMakerMode>>;
  shouldExpandConfigView: boolean;
  setShouldExpandConfigView: Dispatch<SetStateAction<boolean>>;
  focusedPageIndex: number;
  setFocusedPageIndex: Dispatch<SetStateAction<number>>;
  createNewPage: (pageIndex: number, goToLastPage?: boolean) => void;
  chartingActions: ChartingActions;
  setChartingActions: Dispatch<SetStateAction<ChartingActions>>;
  goToNextAction: () => void;
};

export const initialAppMakerContext: AppMakerContext = {
  mode: AppMakerMode.ContentBuilding,
  setMode: () => {},
  shouldExpandConfigView: false,
  setShouldExpandConfigView: () => {},
  focusedPageIndex: 0,
  setFocusedPageIndex: () => {},
  createNewPage: () => {},
  chartingActions: {
    isCompleted: false,
    cachedActionTree: [],
  },
  setChartingActions: () => {},
  goToNextAction: () => {},
};

export const AppMakerContext = createContext<AppMakerContext>(
  initialAppMakerContext,
);
