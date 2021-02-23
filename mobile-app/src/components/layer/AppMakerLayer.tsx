import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setMakerConfig } from '@reduxApp/builder/actions';

import {
  AppMakerContext,
  initialAppMakerContext,
} from '@utilities/context/AppMakerContext';
import { initialiseNewPage } from '@utilities/functions/initialiseNewPage';

export const AppMakerLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const [shouldExpandConfigView, setShouldExpandConfigView] = useState<boolean>(
    initialAppMakerContext.shouldExpandConfigView,
  );

  const [focusedPageIndex, setFocusedPageIndex] = useState<number>(0);

  const [shouldFocusOnLastPage, setShouldFocusOnLastPage] = useState<boolean>(
    false,
  );
  const [lastPage, setLastPage] = useState<number>(0);

  const createNewPage = useCallback(
    (pageIndex: number, goToLastPage?: boolean) => {
      const newMakerConfig = {
        pages: { [pageIndex]: initialiseNewPage() },
      };
      dispatch(setMakerConfig(newMakerConfig));
      if (goToLastPage) {
        setShouldFocusOnLastPage(true);
        setLastPage(pageIndex);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (shouldFocusOnLastPage) {
        setFocusedPageIndex(lastPage);
        setShouldFocusOnLastPage(false);
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [shouldFocusOnLastPage, lastPage]);

  return (
    <AppMakerContext.Provider
      value={{
        shouldExpandConfigView,
        setShouldExpandConfigView,
        focusedPageIndex,
        setFocusedPageIndex,
        createNewPage,
      }}>
      {children}
    </AppMakerContext.Provider>
  );
};
