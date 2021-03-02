import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { Box, Boxes, Page, Pages } from '@models/app-maker';

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

  const { mode, cachedPages, setCachedPages } = useAppMakerContext();

  const page = useMemo(() => cachedPages[pageKey], [cachedPages, pageKey]);

  const [cachedTitle, setCachedTitle] = useState<string>(title);

  useEffect(() => setCachedTitle(title), [title]);

  const onBlur = useCallback(() => {
    const updatedPage: Page = {
      ...page,
      boxes: {
        ...page.boxes,
        [boxKey]: { title: cachedTitle },
      },
    };
    const updatedPages: Pages = { ...cachedPages, [pageKey]: updatedPage };
    setCachedPages(updatedPages);
  }, [pageKey, boxKey, cachedTitle, cachedPages, setCachedPages, page]);

  const editable = useMemo(() => mode === AppMakerMode.ContentBuilding, [mode]);

  const styles = StyleSheet.create({
    text: {
      color: theme['text-basic-color'],
      textAlign: 'center',
      ...tailwind('font-bold text-2xl text-center'),
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
