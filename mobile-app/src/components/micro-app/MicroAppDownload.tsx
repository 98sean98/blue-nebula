import React, { FC } from 'react';
import { View, ViewProps } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sentenceCase } from 'change-case';

import { setShouldFetchMicroApp } from '@reduxApp/application/actions';

import { renderIcon } from '@components/shared/interface';

import { useCasingForENTranslation } from '@utilities/hooks';

interface MicroAppDownloadProps extends ViewProps {}

export const MicroAppDownload: FC<MicroAppDownloadProps> = ({ ...props }) => {
  const { t } = useTranslation('microApp');

  const dispatch = useDispatch();

  const onButtonPress = () => {
    dispatch(setShouldFetchMicroApp(true));
  };

  return (
    <View {...props}>
      <Button
        appearance={'outline'}
        accessoryLeft={renderIcon('cloud-download-outline')}
        onPress={onButtonPress}>
        {useCasingForENTranslation(t('download data'), sentenceCase)}
      </Button>
    </View>
  );
};
