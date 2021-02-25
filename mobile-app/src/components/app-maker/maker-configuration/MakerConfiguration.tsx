import React, { FC, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  ViewProps,
} from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { Page } from '@models/app-maker';

import { RootState } from '@reduxApp';

import { LayoutBox } from './LayoutBox';
import { PageInfo } from './PageInfo';

import { useAppMakerContext } from '@utilities/hooks';

interface MakerConfigurationProps extends ViewProps {}

export const MakerConfiguration: FC<MakerConfigurationProps> = ({
  ...props
}) => {
  const { makerConfig } = useSelector((state: RootState) => state.builder);

  const {
    setShouldExpandConfigView,
    focusedPageIndex,
    createNewPage,
  } = useAppMakerContext();

  const focusedPage: Page | undefined = useMemo(
    () => makerConfig.pages[focusedPageIndex],
    [makerConfig.pages, focusedPageIndex],
  );

  const pageCount: number = useMemo(
    () => Object.entries(makerConfig.pages).length,
    [makerConfig.pages],
  );

  const onFirstPageCreatePress = () => {
    setShouldExpandConfigView(true);
    createNewPage(0);
  };

  return (
    <View {...props}>
      {pageCount === 0 && typeof focusedPage === 'undefined' ? (
        <View style={tailwind('mt-1 px-4 flex-row justify-between')}>
          <Text style={tailwind('w-4/5')}>
            Your app doesn't have any pages yet. Create the first one?
          </Text>
          <Button appearance={'ghost'} onPress={onFirstPageCreatePress}>
            Yes
          </Button>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={'padding'}
          keyboardVerticalOffset={150}>
          <ScrollView contentContainerStyle={tailwind('px-4 pt-1 pb-2')}>
            <PageInfo
              pageIndex={focusedPageIndex}
              page={focusedPage}
              pageCount={pageCount}
            />

            {/* layout box */}
            <LayoutBox
              pageIndex={focusedPageIndex}
              page={focusedPage}
              style={tailwind('mt-2')}
            />

            {/* todo: figure out how to tie configurations to setups */}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};
