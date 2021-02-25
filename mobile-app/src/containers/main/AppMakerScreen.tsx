import React, { FC, ReactNode } from 'react';
import { Dimensions, KeyboardAvoidingView, View } from 'react-native';
import { ViewPager } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { AppMakerScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

import { Box, Boxes, Pages } from '@models/app-maker';

import {
  AnimatedFlingContainer,
  LayoutDivider,
  MakerConfiguration,
  MakerBox,
} from '@components/app-maker';

import { useAppMakerContext } from '@utilities/hooks';
import { getBoxesBasedOnLayout } from '@utilities/functions/getBoxesBasedOnLayout';

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

export const AppMakerScreen: FC<AppMakerScreenProps> = () => {
  const { makerConfig } = useSelector((state: RootState) => state.builder);

  const { focusedPageIndex, setFocusedPageIndex } = useAppMakerContext();

  const renderItem = (item: {
    pageKey: keyof Pages;
    boxKey: keyof Boxes;
    box: Box;
  }): ReactNode => (
    <MakerBox {...item} style={[{ flex: 1 }, tailwind('m-1')]} />
  );

  return (
    <View style={[{ flex: 1 }, tailwind('relative')]}>
      {Object.entries(makerConfig.pages).length !== 0 ? (
        <ViewPager
          style={{ flex: 1 }}
          selectedIndex={focusedPageIndex}
          onSelect={setFocusedPageIndex}>
          {Object.entries(makerConfig.pages).map(([key, { layout, boxes }]) => (
            <KeyboardAvoidingView
              key={key}
              style={{ flex: 1 }}
              behavior={'padding'}
              keyboardVerticalOffset={90}>
              <LayoutDivider
                pageKey={key}
                layout={layout}
                boxes={getBoxesBasedOnLayout(boxes, layout)}
                renderItem={renderItem}
              />
            </KeyboardAvoidingView>
          ))}
        </ViewPager>
      ) : null}

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
