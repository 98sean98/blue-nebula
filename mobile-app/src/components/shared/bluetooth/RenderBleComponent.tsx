import React, { FC } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

interface RenderBleComponent {
  overrideShouldShow?: boolean;
  shouldShowHelperText?: boolean;
}

export const RenderBleComponent: FC<RenderBleComponent> = ({
  overrideShouldShow,
  shouldShowHelperText = true,
  children,
}) => {
  const { t } = useTranslation('bluetooth');

  const isBleRpiDeviceConnected = useSelector(
    (state: RootState) => state.bluetooth.isBleRpiDeviceConnected,
  );

  const shouldShow = overrideShouldShow ?? isBleRpiDeviceConnected;

  return (
    <>
      {shouldShow ? (
        children
      ) : shouldShowHelperText ? (
        <View
          style={[{ flex: 1 }, tailwind('m-4 justify-center items-center')]}>
          <Text style={tailwind('text-center')}>
            {t('connection.bluetooth is not connected') as string}
          </Text>
          <Text style={tailwind('mt-2 text-center')}>
            {
              t(
                'connection.make sure to enable bluetooth before connecting',
              ) as string
            }
          </Text>
        </View>
      ) : null}
    </>
  );
};
