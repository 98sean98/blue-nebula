import React, { FC, ReactNode, useEffect, useMemo, useRef } from 'react';
import { KeyboardAvoidingView, ListRenderItem, StyleSheet } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import Carousel, { CarouselProps } from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import { IterableElement } from 'type-fest';

import { tailwind } from '@styles/tailwind';

import { ActionNode, Box, Boxes, Page, Pages } from '@models/app-maker';

import { RootState } from '@reduxApp';

import { LayoutDivider } from './LayoutDivider';
import { MakerBox } from './MakerBox';

import { useAppMakerContext } from '@utilities/hooks';
import { AppMakerMode } from '@utilities/context';
import { traverseActionTree } from '@utilities/functions/traverseActionTree';
import { checkIfActionTreeIsPopulated } from '@utilities/functions/checkIfActionTreeIsPopulated';
import { getBoxesBasedOnLayout } from '@utilities/functions/getBoxesBasedOnLayout';

type Data = Array<[keyof Pages, Page]>;

interface LayoutCarouselProps
  extends Omit<CarouselProps<IterableElement<Data>>, 'data' | 'renderItem'> {}

export const LayoutCarousel: FC<LayoutCarouselProps> = ({ ...props }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    populatedMakerBox: { borderColor: theme['color-success-default-border'] },
    unpopulatedMakerBox: { borderColor: theme['color-warning-default-border'] },
  });

  const { makerConfig } = useSelector((state: RootState) => state.builder);

  const {
    mode,
    focusedPageIndex,
    setFocusedPageIndex,
    chartingActions,
    chartActionIntoTree,
  } = useAppMakerContext();

  const data: Data = useMemo(() => Object.entries(makerConfig.pages), [
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
                tailwind('border-4 rounded-xl overflow-hidden'),
                pressable
                  ? styles.unpopulatedMakerBox
                  : styles.populatedMakerBox,
              ]
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

  return (
    <Carousel
      ref={carouselRef}
      data={data}
      renderItem={renderCarouselItem}
      onSnapToItem={setFocusedPageIndex}
      scrollEnabled={mode !== AppMakerMode.ActionsCharting}
      {...props}
    />
  );
};
