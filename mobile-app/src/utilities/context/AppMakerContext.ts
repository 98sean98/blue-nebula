import { createContext, Dispatch, SetStateAction } from 'react';

import {
  ActionNode,
  ActionTreePath,
  Pages,
  RootActionNode,
} from '@models/app-maker';
import { Setups } from '@models/setup';

export enum AppMakerMode {
  ContentBuilding = '@@AppMakerMode/ContentBuilding',
  ActionsCharting = '@@AppMakerMode/ActionsCharting',
}

export type ChartingActions = {
  isCompleted: boolean;
  chartedActionTree: RootActionNode;
  currentlyTrackedPath: ActionTreePath;
};

type AppMakerContext = {
  mode: AppMakerMode;
  setMode: Dispatch<SetStateAction<AppMakerMode>>;
  shouldExpandConfigView: boolean;
  setShouldExpandConfigView: Dispatch<SetStateAction<boolean>>;
  cachedPages: Pages;
  setCachedPages: Dispatch<SetStateAction<Pages>>;
  focusedPageIndex: number;
  setFocusedPageIndex: Dispatch<SetStateAction<number>>;
  createNewPage: (pageIndex: number, goToLastPage?: boolean) => void;
  deletePage: (pageIndex: number, goToPage?: number) => void;
  resetPages: (goToPage?: number) => void;
  savePagesWithoutUpdatingActions: () => void;
  toggleActionsCharting: () => void;
  chartingActions: ChartingActions;
  setChartingActions: Dispatch<SetStateAction<ChartingActions>>;
  chartActionIntoTree: (
    actionNode: ActionNode,
    options?: { chartIntoRootNode?: boolean },
  ) => void;
  setSetupIntoActionNode: (setupKey: keyof Setups) => void;
};

export const initialAppMakerContext: AppMakerContext = {
  mode: AppMakerMode.ContentBuilding,
  setMode: () => {},
  shouldExpandConfigView: false,
  setShouldExpandConfigView: () => {},
  cachedPages: {},
  setCachedPages: () => {},
  focusedPageIndex: 0,
  setFocusedPageIndex: () => {},
  createNewPage: () => {},
  deletePage: () => {},
  resetPages: () => {},
  savePagesWithoutUpdatingActions: () => {},
  toggleActionsCharting: () => {},
  chartingActions: {
    isCompleted: false,
    chartedActionTree: { children: [] },
    currentlyTrackedPath: [],
  },
  setChartingActions: () => {},
  chartActionIntoTree: () => {},
  setSetupIntoActionNode: () => {},
};

export const AppMakerContext = createContext<AppMakerContext>(
  initialAppMakerContext,
);
