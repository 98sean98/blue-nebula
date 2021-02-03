import React, { FC, useEffect, useState } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button, ButtonProps } from '@ui-kitten/components';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';

interface BleRunIdleButtonProps extends ButtonProps {}

export const BleRunIdleButton: FC<BleRunIdleButtonProps> = ({
  onPress: onHigherOrderPress,
  ...props
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const { read, write } = useBleRpiDeviceCharacteristic('runIdle', 'boolean');

  useEffect(() => {
    read().then((value) => setIsRunning(value as boolean));
  }, [read]);

  const onPress = async (event: GestureResponderEvent) => {
    const value = !isRunning;
    await write(value);
    onHigherOrderPress && onHigherOrderPress(event);
    setIsRunning(value);
  };

  return (
    <Button
      {...props}
      status={isRunning ? 'danger' : 'primary'}
      onPress={onPress}>
      {isRunning ? 'Stop' : 'Start'}
    </Button>
  );
};
