import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

import {
  renderIcon,
  BleConnectingAnimation,
} from '@components/shared/interface';

interface RenderBleComponent {
  overrideShouldShow?: boolean;
  shouldShowHelperText?: boolean;
  allowDangerousOverride?: boolean;
}

export const RenderBleComponent: FC<RenderBleComponent> = ({
  overrideShouldShow,
  shouldShowHelperText = true,
  allowDangerousOverride,
  children,
}) => {
  const { t } = useTranslation('bluetooth');

  const { isBleRpiDeviceConnected, isScanningAndConnecting } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  const shouldShow = overrideShouldShow ?? isBleRpiDeviceConnected;

  const [dangerouslyOverrideBle, setDangerouslyOverrideBle] = useState<boolean>(
    false,
  );

  const onDangerousButtonPress = () => setDangerouslyOverrideBle(true);

  return (
    <>
      {shouldShow || dangerouslyOverrideBle ? (
        children
      ) : shouldShowHelperText ? (
        <View
          style={[{ flex: 1 }, tailwind('m-4 justify-center items-center')]}>
          {isScanningAndConnecting ? (
            <BleConnectingAnimation />
          ) : (
            <Text style={tailwind('text-center')}>
              {t('connection.connect to bluetooth device') as string}
            </Text>
          )}
          {allowDangerousOverride ? (
            <Button
              status={'warning'}
              accessoryLeft={renderIcon('alert-triangle-outline')}
              onPress={onDangerousButtonPress}
              style={tailwind('mt-8')}>
              Dangerously render
            </Button>
          ) : null}
        </View>
      ) : null}
    </>
  );
};
