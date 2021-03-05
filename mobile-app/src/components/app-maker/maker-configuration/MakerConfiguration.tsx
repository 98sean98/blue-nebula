import React, { FC, useMemo } from 'react';
import {
  ScrollView,
  View,
  ViewProps,
} from 'react-native';
import { Button, Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { Page } from '@models/app-maker';

import { PageInfo } from './PageInfo';
import { LayoutBoxControl } from './LayoutBoxControl';
import { PageStylesControl } from './PageStylesControl';
import {PlatformKeyboardAvoidingView} from "@components/shared/interface";

import { useAppMakerContext } from '@utilities/hooks';
import { AppMakerMode } from '@utilities/context';

interface MakerConfigurationProps extends ViewProps {}

export const MakerConfiguration: FC<MakerConfigurationProps> = ({
  ...props
}) => {
  const {
    mode,
    setShouldExpandConfigView,
    cachedPages,
    focusedPageIndex,
    createNewPage,
  } = useAppMakerContext();

  const focusedPage: Page | undefined = useMemo(
    () => cachedPages[focusedPageIndex],
    [cachedPages, focusedPageIndex],
  );

  const pageCount: number = useMemo(() => Object.entries(cachedPages).length, [
    cachedPages,
  ]);

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
        <PlatformKeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={150}>
          <ScrollView contentContainerStyle={tailwind('px-4 pt-1 pb-2')}>
            <PageInfo
              pageIndex={focusedPageIndex}
              page={focusedPage}
              pageCount={pageCount}
            />

            {/* layout box */}
            <LayoutBoxControl
              pageIndex={focusedPageIndex}
              page={focusedPage}
              disabled={mode === AppMakerMode.ActionsCharting}
              style={tailwind('mt-2')}
            />

            {/* page styles */}
            <PageStylesControl
              pageIndex={focusedPageIndex}
              page={focusedPage}
              style={tailwind('mt-2')}
            />
          </ScrollView>
        </PlatformKeyboardAvoidingView>
      )}
    </View>
  );
};
