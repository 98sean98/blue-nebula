import React, {
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, ListRenderItem, StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import Carousel from 'react-native-snap-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { IterableElement } from 'type-fest';

import { tailwind } from '@styles/tailwind';

import { SimpleControllerScreenProps } from '@navigation/main';

import {
  ActionNode,
  ActionTreePath,
  Box,
  Boxes,
  Page,
  Pages,
} from '@models/app-maker';
import { PageCarouselData } from '@models/ui';

import { RootState } from '@reduxApp';

import { PressableBoxWithText } from '@components/shared/actionable';
import {
  BleRunIdleButton,
  RenderBleComponent,
} from '@components/shared/bluetooth';
import { LayoutDivider } from '@components/shared/interface';

import { getBoxesBasedOnLayout } from '@utilities/functions/getBoxesBasedOnLayout';
import { traverseActionTree } from '@utilities/functions/traverseActionTree';
import { Setup } from '@models/setup';
import { setControlEntities } from '@reduxApp/control/actions';

const carouselDimensions = {
  slider: Dimensions.get('window').width,
  item: Dimensions.get('window').width,
};

export const SimpleControllerScreen: FC<SimpleControllerScreenProps> = () => {
  const dispatch = useDispatch();

  const {
    setups,
    makerConfig: { pages, actions },
  } = useSelector((state: RootState) => state.builder);

  const [focusedPageIndex, setFocusedPageIndex] = useState<number>(0);
  const [actionTreePath, setActionTreePath] = useState<ActionTreePath>([]);

  const focusedPage: Page | undefined = useMemo(() => pages[focusedPageIndex], [
    pages,
    focusedPageIndex,
  ]);

  const pageCount = useMemo(() => Object.keys(pages).length, [pages]);

  const data: PageCarouselData = useMemo(() => Object.entries(pages), [pages]);

  const carouselRef = useRef<Carousel<IterableElement<typeof data>>>(null);

  const renderCarouselItem: ListRenderItem<IterableElement<typeof data>> = ({
    item: [key, { layout, boxes }],
  }) => (
    <LayoutDivider
      pageKey={key}
      layout={layout}
      boxes={getBoxesBasedOnLayout(boxes, layout)}
      renderItem={renderLayoutDividerItem}
    />
  );

  const onBoxPress = (boxKey: keyof Boxes): void => {
    let newPath = actionTreePath;
    if (focusedPageIndex === 0) newPath = [boxKey];
    else newPath.push(boxKey);

    setActionTreePath(newPath);

    if (focusedPageIndex === pageCount - 1) {
      const lastActionNode = traverseActionTree(actions, newPath);
      // if the action node is undefined, return as this should be a no-op
      if (typeof lastActionNode === 'undefined') return;

      const setupKey = (lastActionNode as ActionNode).setupKey;
      if (typeof setupKey !== 'undefined') {
        const setup: Setup | undefined = setups[setupKey];
        if (typeof setup !== 'undefined')
          dispatch(setControlEntities(setup.controlEntitiesState));
      }
      setFocusedPageIndex(0);
    } else {
      setFocusedPageIndex(focusedPageIndex + 1);
    }
  };

  const styles = StyleSheet.create({
    text: { ...(focusedPage?.styles.box.text ?? {}) },
  });

  const renderLayoutDividerItem = (item: {
    pageKey: keyof Pages;
    boxKey: keyof Boxes;
    box: Box;
  }): ReactNode => (
    <PressableBoxWithText
      text={item.box.title}
      textProps={{ style: styles.text }}
      onPress={() => onBoxPress(item.boxKey)}
      style={[{ flex: 1 }, tailwind('m-1')]}
    />
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

  const showController = useMemo(() => pageCount > 0, [pageCount]);

  return (
    <RenderBleComponent>
      <View style={{ flex: 1 }}>
        {showController ? (
          <>
            <Carousel
              ref={carouselRef}
              data={data}
              renderItem={renderCarouselItem}
              onSnapToItem={setFocusedPageIndex}
              sliderWidth={carouselDimensions.slider}
              itemWidth={carouselDimensions.item}
              scrollEnabled={false}
            />
            <BleRunIdleButton style={tailwind('m-4')} />
          </>
        ) : (
          <View
            style={[{ flex: 1 }, tailwind('m-4 justify-center items-center')]}>
            <Text style={tailwind('text-center')}>
              This simple controller has not been configured by the App Maker
              yet.
            </Text>
          </View>
        )}
      </View>
    </RenderBleComponent>
  );
};
