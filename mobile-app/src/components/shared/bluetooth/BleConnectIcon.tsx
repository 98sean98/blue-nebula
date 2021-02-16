import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonProps, Icon, IconProps } from '@ui-kitten/components';

import { RootState } from '@reduxApp';
import {
  cancelConnect,
  connectAsync,
  setIsBleRpiDeviceConnected,
} from '@reduxApp/bluetooth/actions';

interface BleConnectIconProps extends Omit<ButtonProps, 'onPress'> {
  iconProps?: IconProps;
}

export const BleConnectIcon: FC<BleConnectIconProps> = ({
  iconProps,
  ...props
}) => {
  const dispatch = useDispatch();
  const { isScanningAndConnecting, isBleRpiDeviceConnected } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  const onPress = () => {
    if (!isScanningAndConnecting) dispatch(connectAsync());
    else dispatch(cancelConnect());
  };

  const onLongPress = () => {
    if (isScanningAndConnecting) dispatch(cancelConnect());
    if (isBleRpiDeviceConnected) dispatch(setIsBleRpiDeviceConnected(false));
  };

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
      accessoryLeft={(accessoryProps) => (
        <Icon {...accessoryProps} {...iconProps} name={'bluetooth'} />
      )}
      {...props}
      onPress={onPress}
      onLongPress={onLongPress}
    />
  );
};
