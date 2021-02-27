import React, { FC, useCallback, useMemo, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Boxes, Page, Pages } from '@models/app-maker';

import { RootState } from '@reduxApp';
import { setMakerConfig } from '@reduxApp/builder/actions';

import {
  PressableBox,
  PressableBoxProps,
} from '@components/shared/actionable/box/PressableBox';

import { useAppMakerContext } from '@utilities/hooks';
import { AppMakerMode } from '@utilities/context';

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

  const { mode } = useAppMakerContext();

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

  const editable = useMemo(() => mode === AppMakerMode.ContentBuilding, [mode]);

  const styles = StyleSheet.create({
    text: {
      color: theme['text-basic-color'],
      textAlign: 'center',
      ...page.styles.box.text,
    },
  });

  return (
    <PressableBox {...props}>
      {editable ? (
        <TextInput
          style={styles.text}
          value={cachedTitle}
          onChangeText={setCachedTitle}
          onBlur={onBlur}
          placeholder={'Title'}
          placeholderTextColor={theme['text-hint-color']}
          multiline
        />
      ) : (
        <Text style={styles.text}>{cachedTitle}</Text>
      )}
    </PressableBox>
  );
};
