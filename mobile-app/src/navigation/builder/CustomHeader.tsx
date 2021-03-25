import React, { FC, useMemo } from 'react';
import { Platform } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack/lib/typescript/src/types';
import { Divider, TopNavigation, Button } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { sentenceCase } from 'change-case';

import { tailwind } from '@styles/tailwind';

import { useCasingForENTranslation } from '@utilities/hooks';

export const CustomHeader: FC<StackHeaderProps> = ({
  scene: { route, descriptor },
  navigation,
  insets: { top },
  previous,
}) => {
  const { t } = useTranslation();

  const { options } = descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : route.name;

  const cancelText = useMemo(() => t('general.cancel'), [t]);
  const casedCancelText = useCasingForENTranslation(cancelText, sentenceCase);

  const renderLeftAction = () => (
    <Button
      appearance={'ghost'}
      style={tailwind('p-1')}
      onPress={navigation.goBack}>
      {casedCancelText}
    </Button>
  );

  const marginTop = Platform.OS === 'ios' ? top : 0; // only on ios to give space to status bar

  return (
    <>
      <TopNavigation
        title={title as string}
        alignment={'center'}
        accessoryLeft={previous ? renderLeftAction : undefined}
        style={{ marginTop }}
      />
      <Divider />
    </>
  );
};
