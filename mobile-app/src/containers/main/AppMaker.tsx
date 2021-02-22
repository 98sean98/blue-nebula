import React, { FC } from 'react';
import { Dimensions, View } from 'react-native';

import { AppMakerScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { AnimatedFlingContainer, LayoutDivider } from '@components/app-maker';

export type ConfigurationViewHeight = {
  collapsed: number;
  expanded: number;
  fling: number;
};

const configurationViewHeight: ConfigurationViewHeight = {
  collapsed: 80,
  expanded: Dimensions.get('window').height * 0.75,
  fling: 24,
};

export const AppMaker: FC<AppMakerScreenProps> = () => {
  return (
    <View style={[{ flex: 1 }, tailwind('relative')]}>
      <LayoutDivider
        layout={{
          rows: 4,
          columns: 3,
        }}
      />

      <View style={{ height: configurationViewHeight.collapsed }} />
      <AnimatedFlingContainer
        configurationViewHeight={configurationViewHeight}
        style={tailwind('absolute bottom-0 z-10 w-full')}>
        <View style={{ flex: 1, backgroundColor: 'lightblue' }} />
      </AnimatedFlingContainer>
    </View>
  );
};
