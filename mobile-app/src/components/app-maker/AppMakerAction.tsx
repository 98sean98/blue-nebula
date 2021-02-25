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

import { RootState } from '@reduxApp';

import { renderIcon } from '@components/shared/interface';

import { getBackdropStyle } from '@utilities/functions/ui';
import { useAppMakerContext } from '@utilities/hooks';

interface AppMakerActionProps {
  iconProps?: IconProps;
}

export const AppMakerAction: FC<AppMakerActionProps> = ({ iconProps }) => {
  const { createNewPage } = useAppMakerContext();

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
