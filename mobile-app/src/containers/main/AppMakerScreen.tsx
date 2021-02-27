import React, { FC, useEffect } from 'react';
import { Dimensions, View } from 'react-native';

import { AppMakerScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import {
  AnimatedFlingContainer,
  LayoutCarousel,
  MakerConfiguration,
} from '@components/app-maker';

import { useAppMakerContext } from '@utilities/hooks';

export type ConfigurationViewHeight = {
  collapsed: number;
  expanded: number;
  fling: number;
};

const configurationViewHeight: ConfigurationViewHeight = {
  collapsed: 80,
  expanded: Dimensions.get('window').height * 0.75,
  fling: 28,
};

const carouselDimensions = {
  slider: Dimensions.get('window').width,
  item: Dimensions.get('window').width,
};

export const AppMakerScreen: FC<AppMakerScreenProps> = () => {
  const { chartingActions } = useAppMakerContext();

  useEffect(() => {
    if (chartingActions.isCompleted)
      console.log('every possible action has been populated! yay!');
  }, [chartingActions.isCompleted]);

  return (
    <View style={[{ flex: 1 }, tailwind('relative')]}>
      <LayoutCarousel
        sliderWidth={carouselDimensions.slider}
        itemWidth={carouselDimensions.item}
      />

      <View style={{ height: configurationViewHeight.collapsed }} />
      <AnimatedFlingContainer
        configurationViewHeight={configurationViewHeight}
        style={[
          tailwind('absolute z-10 w-full'),
          {
            bottom:
              configurationViewHeight.collapsed -
              configurationViewHeight.expanded,
          },
        ]}>
        <MakerConfiguration style={{ flex: 1 }} />
      </AnimatedFlingContainer>
    </View>
  );
};
