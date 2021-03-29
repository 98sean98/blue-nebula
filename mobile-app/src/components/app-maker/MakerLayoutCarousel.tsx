import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { ListRenderItem, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import Carousel, { CarouselProps } from 'react-native-snap-carousel';
import { IterableElement } from 'type-fest';

import { tailwind } from '@styles/tailwind';

import { ActionNode, Box, Boxes, Page, Pages } from '@models/app-maker';
import { PageCarouselData } from '@models/ui';

import {
  LayoutDivider,
  PlatformKeyboardAvoidingView,
} from '@components/shared/interface';
import { MakerBox } from './MakerBox';

import { useAppMakerContext } from '@utilities/hooks';
import { AppMakerMode } from '@utilities/context';
import {
  checkIfActionTreeIsPopulated,
  getBoxesBasedOnLayout,
  traverseActionTree,
} from '@utilities/functions/app-maker';

interface MakerLayoutCarouselProps
  extends Omit<
    CarouselProps<IterableElement<PageCarouselData>>,
    'data' | 'renderItem'
  > {
  toggleShowSetupsSelection: () => void;
}

export const MakerLayoutCarousel: FC<MakerLayoutCarouselProps> = ({
  toggleShowSetupsSelection,
  ...props
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    populatedMakerBox: { borderColor: theme['color-success-default-border'] },
    unpopulatedMakerBox: { borderColor: theme['color-warning-default-border'] },
  });

  const {
    mode,
    cachedPages,
    setCachedPages,
    focusedPageIndex,
    setFocusedPageIndex,
    chartingActions,
    chartActionIntoTree,
  } = useAppMakerContext();

  const data: PageCarouselData = useMemo(() => Object.entries(cachedPages), [
    cachedPages,
  ]);

  const carouselRef = useRef<Carousel<IterableElement<typeof data>>>(null);

  const onPageTitleChange = useCallback(
    (title: string) => {
      const focusedPage = cachedPages[focusedPageIndex];
      const updatedPage: Page = {
        ...focusedPage,
        title: title === '' ? undefined : title,
      };
      setCachedPages((currentCachedPages) => ({
        ...currentCachedPages,
        [focusedPageIndex]: updatedPage,
      }));
    },
    [focusedPageIndex, cachedPages, setCachedPages],
  );

  const renderCarouselItem: ListRenderItem<IterableElement<typeof data>> = ({
    item: [key, { title, layout, boxes }],
  }) => (
    <PlatformKeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={90}>
      <TextInput
        value={title}
        onChangeText={onPageTitleChange}
        placeholder={'Page title'}
        placeholderTextColor={theme['text-hint-color']}
        textAlign={'center'}
        textAlignVertical={'center'}
        style={[tailwind('mt-4 text-lg'), { color: theme['text-basic-color'] }]}
      />
      <LayoutDivider
        style={tailwind('mt-2')}
        pageKey={key}
        layout={layout}
        boxes={getBoxesBasedOnLayout(boxes, layout)}
        renderItem={renderLayoutDividerItem}
      />
    </PlatformKeyboardAvoidingView>
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
      ? cachedPages[focusedPageIndex + 1].layout.boxCount
      : undefined;
    const actionNode: ActionNode = {
      boxKey,
      fullChildrenCount,
    };
    const chartIntoRootNode = focusedPageIndex === 0;
    chartActionIntoTree(actionNode, {
      chartIntoRootNode,
    });

    // go to the next page if it exists, else go to the first page
    if (isNotLastPage) setFocusedPageIndex(focusedPageIndex + 1);
    else setFocusedPageIndex(0);

    // show the setups selection if this is the last page
    if (!isNotLastPage) toggleShowSetupsSelection();
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
        onPress={() => onMakerBoxPress(item.boxKey)}
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
