import React, { FC, useCallback, useMemo } from 'react';
import { ScrollView, View, ViewProps } from 'react-native';
import { Button, Layout as LayoutComponent, Text } from '@ui-kitten/components';
import deepmerge from 'deepmerge';

import { tailwind } from '@styles/tailwind';

import { Layout, Page } from '@models/app-maker';

import { ThemedSlider } from '@components/shared/actionable';

import { useAppMakerContext } from '@utilities/hooks';
import { initialiseNewPage } from '@utilities/functions/initialiseNewPage';

interface MakerConfigurationProps extends ViewProps {}

export const MakerConfiguration: FC<MakerConfigurationProps> = ({
  ...props
}) => {
  const {
    config,
    setConfig,
    setShouldExpandConfigView,
    focusedPageIndex,
  } = useAppMakerContext();

  const focusedPage: Page | undefined = useMemo(
    () => config.pages[focusedPageIndex],
    [config.pages, focusedPageIndex],
  );

  const createNewPage = useCallback(() => {
    setConfig((thisConfig) => {
      const pageCount = Object.keys(thisConfig.pages).length;
      return {
        ...thisConfig,
        pages: { ...thisConfig.pages, [pageCount]: initialiseNewPage() },
      };
    });
  }, [setConfig]);

  const onFirstPageCreatePress = () => {
    setShouldExpandConfigView(true);
    createNewPage();
  };

  const layoutTypes: Array<{ type: keyof Layout; min: number; max: number }> = [
    { type: 'rows', min: 1, max: 8 },
    { type: 'columns', min: 1, max: 5 },
  ];

  const onLayoutVariableChange = (type: keyof Layout, value: number) => {
    setConfig((thisConfig) =>
      deepmerge(thisConfig, {
        pages: { [focusedPageIndex]: { layout: { [type]: value } } },
      }),
    );
  };

  return (
    <View {...props}>
      {Object.entries(config.pages).length === 0 &&
      typeof focusedPage === 'undefined' ? (
        <View style={tailwind('mt-1 px-4 flex-row')}>
          <Text style={tailwind('w-4/5')}>
            Your app does not have any pages yet. Create the first one?
          </Text>
          <Button appearance={'ghost'} onPress={onFirstPageCreatePress}>
            Yes
          </Button>
        </View>
      ) : (
        <ScrollView
          style={tailwind('px-4')}
          showsVerticalScrollIndicator={false}>
          <LayoutComponent style={tailwind('p-2')}>
            <Text category={'h6'}>Layout boxes</Text>
            {/* layout rows and columns */}
            <View style={tailwind('mt-1')}>
              {layoutTypes.map(({ type, min, max }) => (
                <View
                  key={type}
                  style={tailwind(
                    'w-full flex-row justify-between items-center',
                  )}>
                  <Text>{type}</Text>
                  <View
                    style={tailwind(
                      'w-2/3 flex-row justify-between items-center',
                    )}>
                    <ThemedSlider
                      style={tailwind('w-11/12 h-8')}
                      minimumValue={min}
                      maximumValue={max}
                      step={1}
                      value={focusedPage.layout[type]}
                      onSlidingComplete={(value: number) =>
                        onLayoutVariableChange(type, value)
                      }
                    />
                    <Text category={'s1'}>{focusedPage.layout[type]}</Text>
                  </View>
                </View>
              ))}
            </View>
          </LayoutComponent>
        </ScrollView>
      )}
    </View>
  );
};
