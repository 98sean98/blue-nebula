import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@reduxApp';
import { setMakerConfig } from '@reduxApp/builder/actions';

import {
  AppMakerContext,
  ChartingActions,
  initialAppMakerContext,
} from '@utilities/context/AppMakerContext';
import { initialiseNewPage } from '@utilities/functions/initialiseNewPage';

export const AppMakerLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const {
    makerConfig: {
      pages,
      // actions
    },
  } = useSelector((state: RootState) => state.builder);

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
        pages: { ...pages, [pageIndex]: initialiseNewPage() },
      };
      dispatch(setMakerConfig(newMakerConfig));
      if (goToLastPage) {
        setShouldFocusOnLastPage(true);
        setLastPage(pageIndex);
      }
    },
    [dispatch, pages],
  );

  const [
    chartingActions,
    // setChartingActions
  ] = useState<ChartingActions>({
    isCompleted: false,
    currentlyCharting: { boxKey: '0' },
  });

  // const goToNext = useCallback(() => {
  //   // dfs the actions tree to chart every option to a setup
  // }, [actions, chartingActions.currentlyCharting]);

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
        chartingActions,
      }}>
      {children}
    </AppMakerContext.Provider>
  );
};
