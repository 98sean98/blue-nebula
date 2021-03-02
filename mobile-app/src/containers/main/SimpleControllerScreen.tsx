import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Dimensions,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';
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
import { Setup } from '@models/setup';
import { PageCarouselData } from '@models/ui';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';

import { PressableBoxWithText } from '@components/shared/actionable';
import {
  BleRunIdleButton,
  RenderBleComponent,
} from '@components/shared/bluetooth';
import { LayoutDivider } from '@components/shared/interface';

import { traverseActionTree } from '@utilities/functions/traverseActionTree';
import { checkIfActionTreeLeadsToSetup } from '@utilities/functions/checkIfActionTreeLeadsToSetup';
import moment from 'moment';

const carouselDimensions = {
  slider: Dimensions.get('window').width,
  item: Dimensions.get('window').width,
};

const renderAlert = () =>
  Alert.alert(
    'Setup Not Found Error',
    'There was an error while looking for the setup according to the boxes you have pressed. Please contact the app developer about this issue.',
  );

export const SimpleControllerScreen: FC<SimpleControllerScreenProps> = () => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const {
    setups,
    makerConfig: { pages, actions, updatedAt },
  } = useSelector((state: RootState) => state.builder);

  const [focusedPageIndex, setFocusedPageIndex] = useState<number>(0);
  const [actionTreePath, setActionTreePath] = useState<ActionTreePath>([]);
  const [makerConfigUpdatedAt, setMakerConfigUpdatedAt] = useState<Date>(
    updatedAt,
  );

  const focusedPage: Page | undefined = useMemo(() => pages[focusedPageIndex], [
    pages,
    focusedPageIndex,
  ]);

  const pageCount = useMemo(() => Object.keys(pages).length, [pages]);

  const data: PageCarouselData = useMemo(() => Object.entries(pages), [pages]);

  const carouselRef = useRef<Carousel<IterableElement<typeof data>>>(null);

  const [carouselScrollEnabled, setCarouselScrollEnabled] = useState<boolean>(
    false,
  );

  const renderCarouselItem: ListRenderItem<IterableElement<typeof data>> = ({
    item: [key, { layout, boxes }],
  }) => (
    <LayoutDivider
      pageKey={key}
      layout={layout}
      boxes={boxes}
      renderItem={renderLayoutDividerItem}
    />
  );

  const onBoxPress = (pageIndex: number, boxKey: keyof Boxes): void => {
    const newPath = actionTreePath.slice(0, pageIndex).concat([boxKey]);

    if (focusedPageIndex === pageCount - 1) {
      const lastActionNode = traverseActionTree(actions, newPath);
      // if the action node is undefined, return as this should be a no-op
      if (typeof lastActionNode === 'undefined') return;

      const setupKey = (lastActionNode as ActionNode).setupKey;
      if (typeof setupKey !== 'undefined') {
        const setup: Setup | undefined = setups[setupKey];
        if (typeof setup !== 'undefined') {
          dispatch(setControlEntities(setup.controlEntitiesState));
          // enable carousel scrolling on the last page as a setup is found
          setCarouselScrollEnabled(true);
        } else renderAlert();
      } else renderAlert();
    } else {
      setFocusedPageIndex(focusedPageIndex + 1);
      // disable carousel scrolling when a new path is being tracked as boxes are being pressed
      setCarouselScrollEnabled(false);
    }

    setActionTreePath(newPath);
  };

  const styles = StyleSheet.create({
    text: { ...(focusedPage?.styles.box.text ?? {}) },
    pressableBox: {},
    unPressableBox: { opacity: 0.4 },
    highlightedBox: { borderColor: theme['color-success-default'] },
  });

  const checkIfBoxIsPressable = (
    pageIndex: number,
    boxKey: keyof Boxes,
  ): boolean => {
    const thisBoxPath = actionTreePath.slice(0, pageIndex).concat([boxKey]);
    const subTree = traverseActionTree(actions, thisBoxPath);
    return (
      typeof subTree !== 'undefined' && checkIfActionTreeLeadsToSetup(subTree)
    );
  };

  const checkIfBoxIsHighlighted = (
    pageIndex: number,
    boxKey: keyof Boxes,
  ): boolean => actionTreePath[pageIndex] === boxKey;

  const renderLayoutDividerItem = (item: {
    pageKey: keyof Pages;
    boxKey: keyof Boxes;
    box: Box;
  }): ReactNode => {
    const pressable = checkIfBoxIsPressable(
      parseFloat(item.pageKey),
      item.boxKey,
    );
    const isHighlighted = checkIfBoxIsHighlighted(
      parseFloat(item.pageKey),
      item.boxKey,
    );
    return (
      <PressableBoxWithText
        text={item.box.title}
        textProps={{ style: styles.text }}
        disabled={!pressable}
        onPress={() => onBoxPress(parseFloat(item.pageKey), item.boxKey)}
        style={[
          { flex: 1 },
          tailwind('m-1'),
          pressable ? styles.pressableBox : styles.unPressableBox,
          isHighlighted
            ? [
                tailwind('border-4 rounded-xl overflow-hidden'),
                styles.highlightedBox,
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

  // reset the screen state when pages / actions are updated
  useFocusEffect(
    useCallback(() => {
      if (moment(makerConfigUpdatedAt).isBefore(moment(updatedAt))) {
        setFocusedPageIndex(0);
        setActionTreePath([]);
        setMakerConfigUpdatedAt(updatedAt);
        setCarouselScrollEnabled(false);
      }
    }, [makerConfigUpdatedAt, updatedAt]),
  );

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
              scrollEnabled={carouselScrollEnabled}
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
