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
import { useSelector } from 'react-redux';
import { IterableElement } from 'type-fest';

import { tailwind } from '@styles/tailwind';

import { SimpleControllerScreenProps } from '@navigation/main';

import { Box, Boxes, Page, Pages } from '@models/app-maker';
import { PageCarouselData } from '@models/ui';

import { RootState } from '@reduxApp';

import { PressableBoxWithText } from '@components/shared/actionable';
import {
  BleRunIdleButton,
  RenderBleComponent,
} from '@components/shared/bluetooth';
import { LayoutDivider } from '@components/shared/interface';

import { getBoxesBasedOnLayout } from '@utilities/functions/getBoxesBasedOnLayout';

const carouselDimensions = {
  slider: Dimensions.get('window').width,
  item: Dimensions.get('window').width,
};

export const SimpleControllerScreen: FC<SimpleControllerScreenProps> = () => {
  const {
    // setups,
    makerConfig: { pages },
  } = useSelector((state: RootState) => state.builder);

  const [focusedPageIndex, setFocusedPageIndex] = useState<number>(0);

  const focusedPage: Page | undefined = useMemo(() => pages[focusedPageIndex], [
    pages,
    focusedPageIndex,
  ]);

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

  const onBoxPress = (boxKey: keyof Boxes) => {
    console.log(boxKey, 'box pressed!');
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

  const showController = useMemo(() => data.length > 0, [data]);

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
