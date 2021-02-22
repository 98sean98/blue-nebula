import React, { FC, useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { Text, ViewPager } from '@ui-kitten/components';

import { AppMakerScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { MakerConfig } from '@models/app-maker';

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
  const [config, setConfig] = useState<MakerConfig>(
    initialAppMakerContext.config,
  );
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
        config,
        setConfig,
        shouldExpandConfigView,
        setShouldExpandConfigView,
        focusedPageIndex,
        setFocusedPageIndex,
      }}>
      <View style={[{ flex: 1 }, tailwind('relative')]}>
        {Object.entries(config.pages).length !== 0 ? (
          <ViewPager
            style={{ flex: 1 }}
            selectedIndex={focusedPageIndex}
            onSelect={setFocusedPageIndex}>
            {Object.entries(config.pages).map(([key, { layout }]) => (
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
