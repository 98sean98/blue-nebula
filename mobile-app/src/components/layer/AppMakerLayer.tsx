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
import { ActionNode, Pages, RootActionNode } from '@models/app-maker';
import { traverseActionTree } from '@src/utilities/functions/traverseActionTree';
import { checkIfActionTreeIsPopulated } from '@utilities/functions/checkIfActionTreeIsPopulated';
import { getBoxesBasedOnLayout } from '@utilities/functions/getBoxesBasedOnLayout';
import { Setups } from '@models/setup';

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
      if (goToLastPage) setShouldFocusOnLastPage(true);
      setLastPage(pageIndex);
    },
    [dispatch, pages],
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

  const [chartingActions, setChartingActions] = useState<ChartingActions>({
    isCompleted: false,
    chartedActionTree: { children: [] },
    currentlyTrackedPath: [],
  });

  const toggleActionsCharting = useCallback(() => {
    if (mode !== AppMakerMode.ActionsCharting) {
      console.log('start charting actions!');
      // get rid of unnecessary boxes based on box count in layout for each page
      const prunedPages: Pages = {};
      Object.entries(pages).forEach(
        ([key, page]) =>
          (prunedPages[key] = {
            ...page,
            boxes: getBoxesBasedOnLayout(page.boxes, page.layout),
          }),
      );

      // begin charting
      const rootActionNode: RootActionNode = {
        children: [], // todo: replace with redux store maker config actions so that update operations can be performed
        fullChildrenCount: prunedPages[0].layout.boxCount,
      };
      // set context's charting actions state to the root action node
      setChartingActions((thisChartingAction) => ({
        ...thisChartingAction,
        chartedActionTree: rootActionNode,
        currentlyTrackedPath: [],
      }));

      // set pruned pages state into redux
      dispatch(setMakerConfig({ pages: prunedPages }));

      // set focused page to the first one
      setFocusedPageIndex(0);

      // set app maker mode
      setMode(AppMakerMode.ActionsCharting);
    } else {
      console.log('stop charting actions!');
      setMode(AppMakerMode.ContentBuilding);
      dispatch(
        setMakerConfig({
          actions: chartingActions.chartedActionTree,
          updatedAt: new Date(),
        }),
      );
    }
  }, [dispatch, mode, pages, chartingActions.chartedActionTree]);

  const chartActionIntoTree = useCallback(
    (actionNode: ActionNode, options?: { chartIntoRootNode?: boolean }) => {
      const { chartedActionTree, currentlyTrackedPath } = chartingActions;
      const { chartIntoRootNode } = options ?? {
        chartIntoRootNode: false,
      };

      let currentActionNode: RootActionNode | ActionNode | undefined;
      let newPath = currentlyTrackedPath;

      if (chartIntoRootNode) {
        // chart the new action node into the root action node
        currentActionNode = chartedActionTree;
        // set the path to simply containing the new action node's key if the currently focused page is not the last
        newPath = [actionNode.boxKey];
      } else {
        // traverse the tree according to the currently tracked path
        currentActionNode = traverseActionTree(
          chartedActionTree,
          currentlyTrackedPath,
        );
        // if the current action node is undefined, nothing should be updated as this is a no-op
        if (typeof currentActionNode === 'undefined') return;
        // put the new action node's key into the path list
        newPath.push(actionNode.boxKey);
      }

      // put this action node into the children of the node that is currently being charted, either the root node, or a child node
      if (typeof currentActionNode.children === 'undefined')
        currentActionNode.children = [];
      // make sure that this action node does not already exist
      if (
        currentActionNode.children.findIndex(
          ({ boxKey }) => boxKey === actionNode.boxKey,
        ) === -1
      )
        currentActionNode.children.push(actionNode);

      // set charting actions with the updated state
      setChartingActions({
        ...chartingActions,
        chartedActionTree,
        currentlyTrackedPath: newPath,
      });
    },
    [chartingActions],
  );

  const setSetupIntoActionNode = useCallback(
    (setupKey: keyof Setups) => {
      const { chartedActionTree, currentlyTrackedPath } = chartingActions;

      // if the path is empty, not leading to any action node, nothing should be updated as this is a no-op
      if (currentlyTrackedPath.length === 0) return;

      // traverse the tree according to the currently tracked path
      const currentActionNode = traverseActionTree(
        chartedActionTree,
        currentlyTrackedPath,
      );

      // if the current action node is undefined, nothing should be updated as this is a no-op
      if (typeof currentActionNode === 'undefined') return;

      // put the setup key into the action node
      (currentActionNode as ActionNode).setupKey = setupKey;

      // update is completed state if the root action node is populated
      const isCompleted = checkIfActionTreeIsPopulated(chartedActionTree);

      // clear the currently tracked path as the first page should be shown
      const newPath: ChartingActions['currentlyTrackedPath'] = [];

      // set charting actions with the updated state
      setChartingActions({
        isCompleted,
        chartedActionTree,
        currentlyTrackedPath: newPath,
      });
    },
    [chartingActions],
  );

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
        toggleActionsCharting,
        chartingActions,
        setChartingActions,
        chartActionIntoTree,
        setSetupIntoActionNode,
      }}>
      {children}
    </AppMakerContext.Provider>
  );
};
