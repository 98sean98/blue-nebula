import React, { FC, useCallback, useMemo, useState } from 'react';
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

interface MakerBoxProps extends PressableBoxProps {
  pageKey: keyof Pages;
  boxKey: keyof Boxes;
  box: Box;
}

export const MakerBox: FC<MakerBoxProps> = ({
  pageKey,
  boxKey,
  box: { title },
  ...props
}) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const {
    makerConfig: { pages },
  } = useSelector((state: RootState) => state.builder);

  const page = useMemo(() => pages[pageKey], [pages, pageKey]);

  const [cachedTitle, setCachedTitle] = useState<string>(title);

  const onBlur = useCallback(() => {
    const updatedPage: Page = {
      ...page,
      boxes: {
        ...page.boxes,
        [boxKey]: { title: cachedTitle },
      },
    };
    const updatedPages: Pages = { ...pages, [pageKey]: updatedPage };
    dispatch(setMakerConfig({ pages: updatedPages }));
  }, [pageKey, boxKey, cachedTitle, dispatch, pages, page]);

  const styles = StyleSheet.create({
    textInput: {
      color: theme['text-basic-color'],
      textAlign: 'center',
      ...page.styles.box.text,
    },
  });

  return (
    <PressableBox {...props}>
      <TextInput
        style={styles.textInput}
        value={cachedTitle}
        onChangeText={setCachedTitle}
        onBlur={onBlur}
        placeholder={'Title'}
        placeholderTextColor={theme['text-hint-color']}
        multiline
      />
    </PressableBox>
  );
};
