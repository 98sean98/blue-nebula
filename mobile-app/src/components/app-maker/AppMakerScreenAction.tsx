import React, { FC, useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  OverflowMenu,
  TopNavigationAction,
  MenuItem,
  IconProps,
} from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { Pages, RootActionNode } from '@models/app-maker';

import { RootState } from '@reduxApp';

import { renderIcon } from '@components/shared/interface';

import { useAppMakerContext } from '@utilities/hooks';
import { getBackdropStyle } from '@utilities/functions/ui';
import { getBoxesBasedOnLayout } from '@utilities/functions/getBoxesBasedOnLayout';
import { AppMakerMode } from '@utilities/context';

interface AppMakerScreenActionProps {
  iconProps?: IconProps;
}

export const AppMakerScreenAction: FC<AppMakerScreenActionProps> = ({
  iconProps,
}) => {
  const { setMode, createNewPage, setChartingActions } = useAppMakerContext();

  const {
    makerConfig: { pages },
  } = useSelector((state: RootState) => state.builder);

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // todo: build help modal
  const onHelpPress = () => {};

  const onNewPagePress = () => {
    const newPageIndex = Object.keys(pages).length;
    createNewPage(newPageIndex, true);
    setShowMenu(false);
  };

  const showNewPageAction = useMemo(() => Object.keys(pages).length < 5, [
    pages,
  ]);

  const onChartActionsPress = () => {
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
    // set app maker mode
    setMode(AppMakerMode.ActionsCharting);

    setShowMenu(false);
  };

  const renderMenuAction = () => (
    <TopNavigationAction
      icon={renderIcon('more-vertical', iconProps)}
      onPress={toggleMenu}
    />
  );

  return (
    <View style={tailwind('flex-row items-center')}>
      <TopNavigationAction
        icon={renderIcon('question-mark-outline', iconProps)}
        onPress={onHelpPress}
      />
      <OverflowMenu
        anchor={renderMenuAction}
        visible={showMenu}
        onBackdropPress={toggleMenu}
        backdropStyle={getBackdropStyle()}>
        {showNewPageAction ? (
          <MenuItem
            accessoryLeft={renderIcon('plus-square-outline', iconProps)}
            title={'Add a new page'}
            onPress={onNewPagePress}
          />
        ) : (
          <></>
        )}
        <MenuItem
          accessoryLeft={renderIcon('map-outline')}
          title={'Start charting page actions'}
          onPress={onChartActionsPress}
        />
      </OverflowMenu>
    </View>
  );
};
