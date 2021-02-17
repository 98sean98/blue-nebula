import React, { FC, useState } from 'react';
import { Platform, View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack/lib/typescript/src/types';
import {
  TopNavigation,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
  Divider,
} from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { BleConnectIcon } from '@components/shared/bluetooth';
import { renderIcon } from '@components/shared/interface';

import { MainStackParamList } from '@navigation/main/navigationTypes';

export const CustomHeader: FC<StackHeaderProps> = ({
  scene: { route, descriptor },
  navigation,
  insets: { top },
  previous,
}) => {
  const { options } = descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : route.name;

  const iconProps = { width: 20, height: 20 };

  const renderLeftAction = () => (
    <TopNavigationAction
      icon={renderIcon('arrow-back', iconProps)}
      onPress={() => navigation.goBack()}
    />
  );

  const menuItems: Array<{
    routeName: keyof MainStackParamList;
    text: string;
    iconName: string;
  }> = [
    {
      routeName: 'SimpleController',
      text: 'Simple Controller',
      iconName: 'grid',
    },
    { routeName: 'DevController', text: 'Dev Controller', iconName: 'flash' },
    { routeName: 'Settings', text: 'Settings', iconName: 'settings-2' },
  ];

  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  const renderMenuAction = () => (
    <TopNavigationAction
      icon={renderIcon('more-vertical', iconProps)}
      onPress={toggleMenu}
    />
  );

  const renderRightActions = () => (
    <View style={tailwind('flex-row items-center')}>
      <BleConnectIcon iconProps={iconProps} style={tailwind('w-10 h-10')} />
      <OverflowMenu
        anchor={renderMenuAction}
        visible={isMenuVisible}
        onBackdropPress={toggleMenu}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        {menuItems.map(({ iconName, text, routeName }, index) => (
          <MenuItem
            key={index}
            accessoryLeft={renderIcon(iconName, iconProps)}
            title={text}
            onPress={() => {
              setIsMenuVisible(false);
              navigation.navigate('Main', { screen: routeName });
            }}
          />
        ))}
      </OverflowMenu>
    </View>
  );

  const marginTop = Platform.OS === 'ios' ? top : 0; // only on ios to give space to status bar

  return (
    <>
      <TopNavigation
        title={title as string}
        alignment={'center'}
        accessoryLeft={previous ? renderLeftAction : undefined}
        accessoryRight={renderRightActions}
        style={{ marginTop }}
      />
      <Divider />
    </>
  );
};
