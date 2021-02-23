import React, { FC, useCallback, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  ViewProps,
} from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { Page } from '@models/app-maker';

import { RootState } from '@reduxApp';
import { setMakerConfig } from '@reduxApp/builder/actions';

import { LayoutBox } from './LayoutBox';

import { useAppMakerContext } from '@utilities/hooks';
import { initialiseNewPage } from '@utilities/functions/initialiseNewPage';

interface MakerConfigurationProps extends ViewProps {}

export const MakerConfiguration: FC<MakerConfigurationProps> = ({
  ...props
}) => {
  const dispatch = useDispatch();

  const { makerConfig } = useSelector((state: RootState) => state.builder);

  const { setShouldExpandConfigView, focusedPageIndex } = useAppMakerContext();

  const focusedPage: Page | undefined = useMemo(
    () => makerConfig.pages[focusedPageIndex],
    [makerConfig.pages, focusedPageIndex],
  );

  const createNewPage = useCallback(() => {
    const pageCount = Object.keys(makerConfig.pages).length;
    const newMakerConfig = {
      pages: { ...makerConfig.pages, [pageCount]: initialiseNewPage() },
    };
    dispatch(setMakerConfig(newMakerConfig));
  }, [dispatch, makerConfig.pages]);

  const onFirstPageCreatePress = () => {
    setShouldExpandConfigView(true);
    createNewPage();
  };

  return (
    <View {...props}>
      {Object.entries(makerConfig.pages).length === 0 &&
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={'padding'}
          keyboardVerticalOffset={150}>
          <ScrollView contentContainerStyle={tailwind('px-4')}>
            <LayoutBox focusedPage={focusedPage} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};
