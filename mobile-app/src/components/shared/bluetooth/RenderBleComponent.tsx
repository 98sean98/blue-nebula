import React, { FC } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Text } from '@ui-kitten/components';

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
            Bluetooth is not connected!
          </Text>
          <Text style={tailwind('mt-2 text-center')}>
            Make sure to enable bluetooth before connecting!
          </Text>
        </View>
      ) : null}
    </>
  );
};
