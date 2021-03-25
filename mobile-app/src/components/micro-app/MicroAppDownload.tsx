import React, { FC } from 'react';
import { View, ViewProps } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

import { setShouldFetchMicroApp } from '@reduxApp/application/actions';

import { renderIcon } from '@components/shared/interface';

interface MicroAppDownloadProps extends ViewProps {}

export const MicroAppDownload: FC<MicroAppDownloadProps> = ({ ...props }) => {
  const dispatch = useDispatch();

  const onButtonPress = () => {
    dispatch(setShouldFetchMicroApp(true));
  };

  return (
    <View {...props}>
      <Button
        appearance={'outline'}
        accessoryLeft={renderIcon('cloud-download-outline')}
        onPress={onButtonPress}>{`Download from the server`}</Button>
    </View>
  );
};
