import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack/lib/typescript/src/types';
import {
  IconProps,
  MenuItem,
  OverflowMenu,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { BleConnectIcon } from '@components/shared/bluetooth';
import { renderIcon } from '@components/shared/interface';

import { getBackdropStyle } from '@utilities/functions/ui';

interface DevControllerScreenActionProps {
  navigation: StackHeaderProps['navigation'];
  iconProps?: IconProps;
}

export const DevControllerScreenAction: FC<DevControllerScreenActionProps> = ({
  navigation,
  iconProps,
}) => {
  const theme = useTheme();

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const renderMenuAction = () => (
    <TopNavigationAction
      icon={renderIcon('more-vertical', iconProps)}
      onPress={toggleMenu}
    />
  );

  const onNewControlEntityPress = () =>
    navigation.navigate('Builder', {
      screen: 'NewControlEntity',
    });

  const onSaveSetupPress = () =>
    navigation.navigate('Builder', { screen: 'SetupsReplacement' });

  const filledIconProps = {
    fill: theme['color-primary-default'],
    ...iconProps,
  };

  return (
    <View style={tailwind('flex-row items-center')}>
      <BleConnectIcon iconProps={iconProps} style={tailwind('w-8 h-8')} />
      <OverflowMenu
        anchor={renderMenuAction}
        visible={showMenu}
        onBackdropPress={toggleMenu}
        backdropStyle={getBackdropStyle()}
        style={tailwind('w-40')}>
        <MenuItem
          accessoryLeft={renderIcon('plus-square-outline', filledIconProps)}
          title={'Create a new control entity'}
          onPress={onNewControlEntityPress}
        />
        <MenuItem
          accessoryLeft={renderIcon('save-outline', filledIconProps)}
          title={'Save setup'}
          onPress={onSaveSetupPress}
        />
      </OverflowMenu>
    </View>
  );
};
