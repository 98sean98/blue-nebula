import React, { FC, ReactNode, useEffect, useMemo, useRef } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  ListRenderItem,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import { IterableElement } from 'type-fest';

import { AppMakerScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

import { Box, Boxes, Pages } from '@models/app-maker';

import {
  AnimatedFlingContainer,
  LayoutDivider,
  MakerBox,
  MakerConfiguration,
} from '@components/app-maker';

import { useAppMakerContext } from '@utilities/hooks';
import { getBoxesBasedOnLayout } from '@utilities/functions/getBoxesBasedOnLayout';
import { AppMakerMode } from '@utilities/context';

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
  const { makerConfig } = useSelector((state: RootState) => state.builder);

  const { mode, focusedPageIndex, setFocusedPageIndex } = useAppMakerContext();

  const data = useMemo(() => Object.entries(makerConfig.pages), [
    makerConfig.pages,
  ]);

  const carouselRef = useRef<Carousel<IterableElement<typeof data>>>(null);

  const renderCarouselItem: ListRenderItem<IterableElement<typeof data>> = ({
    item: [key, { layout, boxes }],
  }) => (
    <KeyboardAvoidingView
      key={key}
      style={{ flex: 1 }}
      behavior={'padding'}
      keyboardVerticalOffset={90}>
      <LayoutDivider
        pageKey={key}
        layout={layout}
        boxes={getBoxesBasedOnLayout(boxes, layout)}
        renderItem={renderLayoutDividerItem}
      />
    </KeyboardAvoidingView>
  );

  const renderLayoutDividerItem = (item: {
    pageKey: keyof Pages;
    boxKey: keyof Boxes;
    box: Box;
  }): ReactNode => (
    <MakerBox {...item} style={[{ flex: 1 }, tailwind('m-1')]} />
  );

  useEffect(() => {
    if (carouselRef.current !== null) {
      const carouselItemIndex = carouselRef.current.currentIndex;
      if (
        typeof carouselItemIndex !== 'undefined' &&
        carouselItemIndex !== focusedPageIndex
      )
        carouselRef.current.snapToItem(focusedPageIndex);
    }
  }, [focusedPageIndex]);

  return (
    <View style={[{ flex: 1 }, tailwind('relative')]}>
      <Carousel
        ref={carouselRef}
        data={data}
        renderItem={renderCarouselItem}
        sliderWidth={carouselDimensions.slider}
        itemWidth={carouselDimensions.item}
        onSnapToItem={setFocusedPageIndex}
        scrollEnabled={mode !== AppMakerMode.ActionsCharting}
        style={{ flex: 1 }}
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
