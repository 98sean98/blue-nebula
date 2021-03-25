import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { AppMakerScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { setMakerConfig } from '@reduxApp/builder/actions';

import {
  AnimatedFlingContainer,
  MakerLayoutCarousel,
  MakerConfiguration,
  SetupsSelection,
} from '@components/app-maker';

import { useAppMakerContext } from '@utilities/hooks';
import { AppMakerMode, AppMakerViewType } from '@utilities/context';

const mainAnimationWidth = {
  overall: Dimensions.get('window').width * 2,
  viewable: Dimensions.get('window').width,
};

export type ConfigurationViewHeight = {
  collapsed: number;
  expanded: number;
  fling: number;
};

const carouselDimensions = {
  slider: Dimensions.get('window').width,
  item: Dimensions.get('window').width,
};

export const AppMakerScreen: FC<AppMakerScreenProps> = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const configurationViewHeight: ConfigurationViewHeight = {
    collapsed: 80 + insets.bottom,
    expanded: Dimensions.get('window').height * 0.75,
    fling: 28,
  };

  const {
    setMode,
    viewType,
    setViewType,
    chartingActions,
  } = useAppMakerContext();

  const slideAnimation = useRef(new Animated.Value(0)).current;

  const slideLeft = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: 0, // translate leftwards, back to initial position
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [slideAnimation]);

  const slideRight = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: -1 * mainAnimationWidth.viewable, // translate rightwards, showing initially hidden view
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [slideAnimation]);

  const toggleShowSetupsSelection = () => {
    if (viewType === AppMakerViewType.Setups) {
      slideLeft();
      setViewType(AppMakerViewType.Layout);
    } else {
      slideRight();
      setViewType(AppMakerViewType.Setups);
    }
  };

  useEffect(() => {
    if (chartingActions.isCompleted) {
      console.log('every possible action has been populated!');
      setMode(AppMakerMode.ContentBuilding);
      dispatch(
        setMakerConfig({
          actions: chartingActions.chartedActionTree,
          updatedAt: new Date(),
        }),
      );
    }
  }, [dispatch, setMode, chartingActions]);

  return (
    <Animated.View
      style={[
        {
          height: '100%',
          width: mainAnimationWidth.overall,
          transform: [{ translateX: slideAnimation }],
        },
        tailwind('flex-row'),
      ]}>
      {/* first view (layout) */}
      <View style={[{ flex: 1 }, tailwind('relative')]}>
        <MakerLayoutCarousel
          sliderWidth={carouselDimensions.slider}
          itemWidth={carouselDimensions.item}
          toggleShowSetupsSelection={toggleShowSetupsSelection}
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

      {/* second view (setups selection) */}
      <SetupsSelection
        onSetupSelected={toggleShowSetupsSelection}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
};
