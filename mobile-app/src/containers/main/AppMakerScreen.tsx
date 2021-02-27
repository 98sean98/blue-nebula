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

import { ActionNode, Box, Boxes, Pages } from '@models/app-maker';

import {
  AnimatedFlingContainer,
  LayoutDivider,
  MakerBox,
  MakerConfiguration,
} from '@components/app-maker';

import { useAppMakerContext } from '@utilities/hooks';
import { getBoxesBasedOnLayout } from '@utilities/functions/getBoxesBasedOnLayout';
import { AppMakerMode } from '@utilities/context';
import { traverseActionTree } from '@utilities/functions/traverseActionTree';
import { checkIfActionTreeIsPopulated } from '@utilities/functions/checkIfActionTreeIsPopulated';

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

  const {
    mode,
    focusedPageIndex,
    setFocusedPageIndex,
    chartingActions,
    chartActionIntoTree,
  } = useAppMakerContext();

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

  const checkIfMakerBoxIsPopulated = (boxKey: keyof Boxes): boolean => {
    const { chartedActionTree, currentlyTrackedPath } = chartingActions;
    const thisBoxPath = currentlyTrackedPath.concat([boxKey]);
    const subTree = traverseActionTree(chartedActionTree, thisBoxPath);
    return (
      typeof subTree !== 'undefined' && checkIfActionTreeIsPopulated(subTree)
    );
  };

  const onMakerBoxPress = (boxKey: keyof Boxes) => {
    const isNotLastPage = focusedPageIndex < data.length - 1;

    // create the action node
    const fullChildrenCount = isNotLastPage
      ? makerConfig.pages[focusedPageIndex + 1].layout.boxCount
      : undefined;
    const setupKey = !isNotLastPage ? 'default' : undefined; // todo: let the user pick the setup after pressing an action node in the last page
    const actionNode: ActionNode = {
      boxKey,
      fullChildrenCount,
      setupKey,
    };
    const chartIntoRootNode = focusedPageIndex === 0;
    chartActionIntoTree(actionNode, {
      chartIntoRootNode,
      resetPath: !isNotLastPage,
    });

    // go to the next page if it exists, else go to the first page
    if (isNotLastPage) setFocusedPageIndex(focusedPageIndex + 1);
    else setFocusedPageIndex(0);
  };

  const renderLayoutDividerItem = (item: {
    pageKey: keyof Pages;
    boxKey: keyof Boxes;
    box: Box;
  }): ReactNode => {
    const pressable =
      mode === AppMakerMode.ActionsCharting &&
      !checkIfMakerBoxIsPopulated(item.boxKey);
    return (
      <MakerBox
        {...item}
        disabled={!pressable}
        onPress={pressable ? () => onMakerBoxPress(item.boxKey) : undefined}
        style={[
          { flex: 1 },
          tailwind('m-1'),
          mode === AppMakerMode.ActionsCharting
            ? [
                tailwind('border-4'),
                pressable
                  ? tailwind('border-yellow-500')
                  : tailwind('border-green-500'),
              ] // todo: style this properly
            : {},
        ]}
      />
    );
  };

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

  useEffect(() => {
    if (chartingActions.isCompleted)
      console.log('every possible action has been populated! yay!');
  }, [chartingActions.isCompleted]);

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
