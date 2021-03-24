import React, { FC } from 'react';
import { View } from 'react-native';
import { Layout, LayoutProps, Text } from '@ui-kitten/components';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { tailwind } from '@styles/tailwind';

import { ActionTreePath } from '@models/app-maker';

import { RootState } from '@reduxApp';

interface ActionTreeSummaryProps extends LayoutProps {
  actionTreePath: ActionTreePath;
}

export const ActionTreePathSummary: FC<ActionTreeSummaryProps> = ({
  actionTreePath,
  ...props
}) => {
  const { t } = useTranslation('control');

  const { pages } = useSelector(
    (state: RootState) => state.builder.makerConfig,
  );

  const selectedBoxes = actionTreePath.map(
    (boxKey, pageIndex) => pages[pageIndex].boxes[boxKey],
  );

  return (
    <Layout {...props}>
      <Text>{t('run/idle.You have selected') as string}</Text>
      <View style={tailwind('mt-2')}>
        {selectedBoxes.map(({ title }, index) => (
          <Text key={index} category={'h6'}>
            {title}
          </Text>
        ))}
      </View>
    </Layout>
  );
};
