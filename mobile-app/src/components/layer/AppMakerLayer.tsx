import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@reduxApp';
import { setMakerConfig } from '@reduxApp/builder/actions';

import {
  AppMakerContext,
  AppMakerMode,
  ChartingActions,
  initialAppMakerContext,
} from '@utilities/context/AppMakerContext';
import { initialiseNewPage } from '@utilities/functions/initialiseNewPage';
import { ActionNode, RootActionNode } from '@models/app-maker';
import { traverseActionTree } from '@src/utilities/functions/traverseActionTree';

export const AppMakerLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const {
    makerConfig: { pages },
  } = useSelector((state: RootState) => state.builder);

  const [mode, setMode] = useState<AppMakerMode>(AppMakerMode.ContentBuilding);

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

  const [chartingActions, setChartingActions] = useState<ChartingActions>({
    isCompleted: false,
    chartedActionTree: { children: [] },
    currentlyTrackedPath: [],
  });

  const chartActionIntoTree = useCallback(
    (actionNode: ActionNode, chartIntoRootNode?: boolean) => {
      const { chartedActionTree, currentlyTrackedPath } = chartingActions;

      let currentActionNode: RootActionNode | ActionNode | undefined;
      let newPath = currentlyTrackedPath;

      if (chartIntoRootNode) {
        // chart the new action node into the root action node
        currentActionNode = chartedActionTree;
        // set the path to simply containing the new action node's key
        newPath = [actionNode.boxKey];
      } else {
        // traverse the tree according to the currently tracked path
        currentActionNode = traverseActionTree(
          chartedActionTree,
          currentlyTrackedPath,
        );
        // put the new action node's key into the path list
        newPath.push(actionNode.boxKey);
      }

      // put this action node into the children of the node that is currently being charted, either the root node, or a child node
      if (typeof currentActionNode.children === 'undefined')
        currentActionNode.children = [];
      currentActionNode.children.push(actionNode);

      // set charting actions with the updated tree
      setChartingActions({
        ...chartingActions,
        chartedActionTree,
        currentlyTrackedPath: newPath,
      });
    },
    [chartingActions],
  );

  console.log(chartingActions);

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
        mode,
        setMode,
        shouldExpandConfigView,
        setShouldExpandConfigView,
        focusedPageIndex,
        setFocusedPageIndex,
        createNewPage,
        chartingActions,
        setChartingActions,
        chartActionIntoTree,
      }}>
      {children}
    </AppMakerContext.Provider>
  );
};
