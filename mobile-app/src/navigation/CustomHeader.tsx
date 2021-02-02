import React, { FC, useState } from 'react';
import { ImageProps, Platform } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack/lib/typescript/src/types';
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
  IconProps,
  Divider,
} from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';

const renderIcon = (
  iconName: string,
  iconProps?: Partial<IconProps>,
): RenderProp<Partial<ImageProps>> => (props) => (
  <Icon {...props} {...iconProps} name={iconName} />
);

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

  const renderBackAction = () => (
    <TopNavigationAction
      icon={(props) => <Icon {...props} name={'arrow-back'} />}
      onPress={() => navigation.goBack()}
    />
  );

  const menuItems = [
    {
      routeName: 'SimpleController',
      text: 'Simple Controller',
      iconName: 'grid',
    },
    { routeName: 'DevController', text: 'Dev Controller', iconName: 'flash' },
  ];

  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  const renderMenuAction = () => (
    <TopNavigationAction
      icon={renderIcon('more-vertical')}
      onPress={toggleMenu}
    />
  );

  const renderRightActions = () => (
    <>
      <TopNavigationAction
        icon={renderIcon('bluetooth')}
        onPress={() => navigation.navigate('DevController')}
      />
      <OverflowMenu
        anchor={renderMenuAction}
        visible={isMenuVisible}
        onBackdropPress={toggleMenu}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        {menuItems.map(({ iconName, text, routeName }, index) => (
          <MenuItem
            key={index}
            accessoryLeft={renderIcon(iconName)}
            title={text}
            onPress={() => {
              setIsMenuVisible(false);
              navigation.navigate(routeName);
            }}
          />
        ))}
      </OverflowMenu>
    </>
  );

  const marginTop = Platform.OS === 'ios' ? top : 0; // only on ios to give space to status bar

  return (
    <>
      <TopNavigation
        title={title as string}
        alignment={'center'}
        accessoryLeft={previous ? renderBackAction : undefined}
        accessoryRight={renderRightActions}
        style={{ marginTop }}
      />
      <Divider />
    </>
  );
};
