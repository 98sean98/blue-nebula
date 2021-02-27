import React, { FC, useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  IconProps,
  MenuItem,
  OverflowMenu,
  TopNavigationAction,
} from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

import { renderIcon } from '@components/shared/interface';

import { useAppMakerContext } from '@utilities/hooks';
import { getBackdropStyle } from '@utilities/functions/ui';
import { AppMakerMode } from '@utilities/context';

interface AppMakerScreenActionProps {
  iconProps?: IconProps;
}

export const AppMakerScreenAction: FC<AppMakerScreenActionProps> = ({
  iconProps,
}) => {
  const { mode, createNewPage, toggleActionsCharting } = useAppMakerContext();

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

  const showNewPageAction = useMemo(
    () =>
      mode === AppMakerMode.ContentBuilding && Object.keys(pages).length < 5,
    [mode, pages],
  );

  const onActionsChartingPress = () => {
    toggleActionsCharting();
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
        {mode !== AppMakerMode.ActionsCharting ? (
          <MenuItem
            accessoryLeft={renderIcon('map-outline')}
            title={'Start charting page actions'}
            onPress={onActionsChartingPress}
          />
        ) : (
          <MenuItem
            accessoryLeft={renderIcon('stop-circle-outline')}
            title={'Stop charting page actions'}
            onPress={onActionsChartingPress}
          />
        )}
      </OverflowMenu>
    </View>
  );
};
