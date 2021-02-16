import React, { FC } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

interface RenderBleComponent {
  overrideShouldShow?: boolean;
}

export const RenderBleComponent: FC<RenderBleComponent> = ({
  overrideShouldShow,
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
      ) : (
        <View style={[{ flex: 1 }, tailwind('justify-center items-center')]}>
          <Text>Bluetooth is not connected!</Text>
        </View>
      )}
    </>
  );
};
