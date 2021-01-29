import React, { FC, useState } from 'react';
import { Button, ButtonProps } from '@ui-kitten/components';
import { GestureResponderEvent } from 'react-native';
import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';

interface BleRunIdleButtonProps extends ButtonProps {}

export const BleRunIdleButton: FC<BleRunIdleButtonProps> = ({
  onPress: onHigherOrderPress,
  ...props
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const { write } = useBleRpiDeviceCharacteristic('runIdle', 'boolean');

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
