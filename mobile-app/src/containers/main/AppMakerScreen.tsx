import React, { FC, useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { Text, ViewPager } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { AppMakerScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

import {
  AnimatedFlingContainer,
  LayoutDivider,
  MakerConfiguration,
} from '@components/app-maker';

import { AppMakerContext, initialAppMakerContext } from '@utilities/context';

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

  const [shouldExpandConfigView, setShouldExpandConfigView] = useState<boolean>(
    initialAppMakerContext.shouldExpandConfigView,
  );

  const [focusedPageIndex, setFocusedPageIndex] = useState<number>(0);

  const renderItem = (boxIndex: number) => (
    <Pressable
      style={[{ flex: 1 }, tailwind('m-1 bg-blue-900')]}
      onPress={() => console.log(boxIndex)}>
      <Text>{boxIndex}</Text>
    </Pressable>
  );

  return (
    <AppMakerContext.Provider
      value={{
        shouldExpandConfigView,
        setShouldExpandConfigView,
        focusedPageIndex,
        setFocusedPageIndex,
      }}>
      <View style={[{ flex: 1 }, tailwind('relative')]}>
        {Object.entries(makerConfig.pages).length !== 0 ? (
          <ViewPager
            style={{ flex: 1 }}
            selectedIndex={focusedPageIndex}
            onSelect={setFocusedPageIndex}>
            {Object.entries(makerConfig.pages).map(([key, { layout }]) => (
              <LayoutDivider
                key={key}
                layout={layout}
                renderItem={renderItem}
              />
            ))}
          </ViewPager>
        ) : null}

        <View style={{ height: configurationViewHeight.collapsed }} />
        <AnimatedFlingContainer
          configurationViewHeight={configurationViewHeight}
          style={tailwind('absolute bottom-0 z-10 w-full')}>
          <MakerConfiguration style={{ flex: 1 }} />
        </AnimatedFlingContainer>
      </View>
    </AppMakerContext.Provider>
  );
};
