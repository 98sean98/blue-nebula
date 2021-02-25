import React, { FC, useCallback, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Boxes, Page, Pages } from '@models/app-maker';

import { RootState } from '@reduxApp';
import { setMakerConfig } from '@reduxApp/builder/actions';

import {
  PressableBox,
  PressableBoxProps,
} from '@components/shared/actionable/box/PressableBox';

import { useAppMakerContext } from '@utilities/hooks';

interface MakerBoxProps extends PressableBoxProps {
  boxKey: keyof Boxes;
  box: Box;
}

export const MakerBox: FC<MakerBoxProps> = ({
  boxKey,
  box: { title },
  ...props
}) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const {
    makerConfig: { pages },
  } = useSelector((state: RootState) => state.builder);

  const { focusedPageIndex } = useAppMakerContext();

  const [cachedTitle, setCachedTitle] = useState<string>(title);

  const onBlur = useCallback(() => {
    const updatedPage: Page = {
      ...pages[focusedPageIndex],
      boxes: {
        ...pages[focusedPageIndex].boxes,
        [boxKey]: { title: cachedTitle },
      },
    };
    const updatedPages: Pages = { ...pages, [focusedPageIndex]: updatedPage };
    dispatch(setMakerConfig({ pages: updatedPages }));
  }, [boxKey, cachedTitle, dispatch, pages, focusedPageIndex]);

  const styles = StyleSheet.create({
    textInput: {
      color: theme['text-basic-color'],
    },
  });

  return (
    <PressableBox {...props}>
      <TextInput
        style={styles.textInput}
        value={cachedTitle}
        onChangeText={setCachedTitle}
        placeholder={'Title'}
        placeholderTextColor={theme['text-hint-color']}
        onBlur={onBlur}
      />
    </PressableBox>
  );
};
