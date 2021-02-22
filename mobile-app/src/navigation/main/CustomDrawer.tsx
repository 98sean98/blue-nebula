import React, { FC } from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer/lib/typescript/src/types';
import { Drawer, DrawerItem, IndexPath } from '@ui-kitten/components';

import { navigationItems } from './navigationItems';

import { renderIcon } from '@components/shared/interface';

export const CustomDrawer: FC<DrawerContentComponentProps> = ({
  state,
  navigation,
}) => (
  <Drawer selectedIndex={new IndexPath(state.index)}>
    {navigationItems.map(({ routeName, text, iconName, screenParams }) => (
      <DrawerItem
        key={routeName}
        title={text}
        accessoryLeft={renderIcon(iconName, { width: 20, height: 20 })}
        onPress={() =>
          navigation.navigate('Main', {
            screen: routeName,
            params: screenParams,
          })
        }
      />
    ))}
  </Drawer>
);
