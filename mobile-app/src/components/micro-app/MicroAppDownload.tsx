import React, { FC, useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@reduxApp';
import { setShouldFetchMicroApps } from '@reduxApp/application/actions';

import { renderIcon } from '@components/shared/interface';

interface MicroAppDownloadProps extends ViewProps {}

export const MicroAppDownload: FC<MicroAppDownloadProps> = ({ ...props }) => {
  const dispatch = useDispatch();

  const focusedMicroAppHeaders = useSelector(
    (state: RootState) => state.application.focusedMicroAppHeaders,
  );

  const onButtonPress = () => {
    dispatch(setShouldFetchMicroApps(true));
  };

  const itemName = useMemo(() => focusedMicroAppHeaders?.name ?? 'Micro App', [
    focusedMicroAppHeaders,
  ]);

  return (
    <View {...props}>
      <Button
        appearance={'outline'}
        accessoryLeft={renderIcon('cloud-download-outline')}
        onPress={
          onButtonPress
        }>{`Download ${itemName} from the server`}</Button>
    </View>
  );
};
