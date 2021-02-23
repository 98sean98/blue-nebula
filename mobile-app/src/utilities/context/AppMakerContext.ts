import { createContext, Dispatch, SetStateAction } from 'react';

type AppMakerContext = {
  shouldExpandConfigView: boolean;
  setShouldExpandConfigView: Dispatch<SetStateAction<boolean>>;
  focusedPageIndex: number;
  setFocusedPageIndex: Dispatch<SetStateAction<number>>;
  createNewPage: (pageIndex: number, goToLastPage?: boolean) => void;
};

export const initialAppMakerContext: AppMakerContext = {
  shouldExpandConfigView: false,
  setShouldExpandConfigView: () => {},
  focusedPageIndex: 0,
  setFocusedPageIndex: () => {},
  createNewPage: () => {},
};

export const AppMakerContext = createContext<AppMakerContext>(
  initialAppMakerContext,
);
