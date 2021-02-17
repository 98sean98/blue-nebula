import React, { FC } from 'react';
import { Platform } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack/lib/typescript/src/types';
import {
  Divider,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

import { renderIcon } from '@components/shared/interface';

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

  const marginTop = Platform.OS === 'ios' ? top : 0; // only on ios to give space to status bar

  return (
    <>
      <TopNavigation
        title={title as string}
        alignment={'center'}
        accessoryLeft={previous ? renderLeftAction : undefined}
        style={{ marginTop }}
      />
      <Divider />
    </>
  );
};
