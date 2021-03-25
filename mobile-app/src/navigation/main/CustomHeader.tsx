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
import { useTranslation } from 'react-i18next';

import { tailwind } from '@styles/tailwind';

import { navigationItems } from './navigationItems';

import { BleConnectIcon } from '@components/shared/bluetooth';
import { DevControllerScreenAction } from '@components/controller/dev';
import { AppMakerScreenAction } from '@components/app-maker';
import { renderIcon } from '@components/shared/interface';

export const CustomHeader: FC<StackHeaderProps> = ({
  scene: { route, descriptor },
  navigation,
  insets: { top },
}) => {
  const { t } = useTranslation();

  const focusedRouteName = getFocusedRouteNameFromRoute(route);
  const foundNavigationItem = navigationItems.find(
    ({ routeName }) => routeName === focusedRouteName,
  );
  const titleI18nKey =
    typeof foundNavigationItem !== 'undefined'
      ? foundNavigationItem.routeName
      : navigationItems[0].routeName;
  const title = t(`navigation.main.${titleI18nKey}`);

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
      case 'DevController':
        return (
          <DevControllerScreenAction
            navigation={navigation}
            iconProps={iconProps}
          />
        );
      case 'Setups':
        return <></>;
      case 'AppMaker':
        return <AppMakerScreenAction />;
      case 'MicroApp':
        return <></>;
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
