import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonProps, Icon, IconProps } from '@ui-kitten/components';

import { RootState } from '@reduxApp';
import {
  cancelConnect,
  connectAsync,
  setIsBleRpiDeviceConnected,
} from '@reduxApp/bluetooth/actions';
import { State } from 'react-native-ble-plx';
import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';

interface BleConnectIconProps extends Omit<ButtonProps, 'onPress'> {
  iconProps?: IconProps;
}

export const BleConnectIcon: FC<BleConnectIconProps> = ({
  iconProps,
  ...props
}) => {
  const dispatch = useDispatch();
  const {
    bleManagerState,
    isScanningAndConnecting,
    isBleRpiDeviceConnected,
  } = useSelector((state: RootState) => state.bluetooth);

  const { write: writeHealthCheck } = useBleRpiDeviceCharacteristic(
    'healthCheck',
    'string',
  );

  const onPress = () => {
    if (!isScanningAndConnecting) dispatch(connectAsync());
    else dispatch(cancelConnect());
  };

  const onLongPress = async () => {
    if (isScanningAndConnecting) dispatch(cancelConnect());
    if (isBleRpiDeviceConnected) {
      try {
        await writeHealthCheck('0');
      } catch (error) {
        console.log(error);
      }
      dispatch(setIsBleRpiDeviceConnected(false));
    }
  };

  // disable the button if ble state is not powered on
  const buttonDisabled = useMemo(() => bleManagerState !== State.PoweredOn, [
    bleManagerState,
  ]);

  // button status depicts icon color
  const status = useMemo(() => {
    if (isScanningAndConnecting) return 'warning'; // yellow
    if (isBleRpiDeviceConnected) return 'primary'; // blue
    return 'danger'; // red
  }, [isScanningAndConnecting, isBleRpiDeviceConnected]);

  return (
    <Button
      appearance={'ghost'}
      status={status}
      disabled={buttonDisabled}
      accessoryLeft={(accessoryProps) => (
        <Icon {...accessoryProps} {...iconProps} name={'bluetooth'} />
      )}
      {...props}
      onPress={onPress}
      onLongPress={onLongPress}
    />
  );
};
