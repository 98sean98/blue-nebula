import React, { FC } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack/lib/typescript/src/types';
import {
  DrawerActions,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {
  TopNavigation,
  TopNavigationAction,
  Divider,
} from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { navigationItems } from './navigationItems';

import { BleConnectIcon } from '@components/shared/bluetooth';
import { AppMakerAction } from '@components/app-maker';
import { renderIcon } from '@components/shared/interface';

export const CustomHeader: FC<StackHeaderProps> = ({
  scene: { route, descriptor },
  insets: { top },
}) => {
  const focusedRouteName = getFocusedRouteNameFromRoute(route);
  const foundNavigationItem = navigationItems.find(
    ({ routeName }) => routeName === focusedRouteName,
  );
  const title =
    typeof foundNavigationItem !== 'undefined'
      ? foundNavigationItem.text
      : navigationItems[0].text;

  const iconProps = { width: 20, height: 20 };

  const renderLeftAction = () => (
    <TopNavigationAction
      icon={renderIcon('list-outline', iconProps)}
      onPress={() =>
        descriptor.navigation.dispatch(DrawerActions.toggleDrawer())
      }
    />
  );

  const renderRightAction = () => {
    switch (foundNavigationItem?.routeName) {
      case 'Setups':
        return <></>;
      case 'AppMaker':
        return <AppMakerAction />;
      default:
        return (
          <BleConnectIcon iconProps={iconProps} style={tailwind('w-8 h-8')} />
        );
    }
  };

  const styles = StyleSheet.create({
    navigation: {
      marginTop: Platform.OS === 'ios' ? top : 0,
    },
  });

  return (
    <>
      <TopNavigation
        title={title as string}
        alignment={'center'}
        accessoryLeft={renderLeftAction}
        accessoryRight={renderRightAction}
        style={styles.navigation}
      />
      <Divider />
    </>
  );
};
