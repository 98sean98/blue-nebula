import React, { FC, useEffect, useState } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button, ButtonProps } from '@ui-kitten/components';

import {
  useBleRpiDeviceCharacteristic,
  useControlEntities,
} from '@utilities/hooks';

import { renderBleErrorAlert } from '@components/shared/bluetooth/renderBleErrorAlert';

interface BleRunIdleButtonProps extends ButtonProps {}

export const BleRunIdleButton: FC<BleRunIdleButtonProps> = ({
  onPress: onHigherOrderPress,
  ...props
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const { read, write } = useBleRpiDeviceCharacteristic('runIdle', 'boolean');

  const { writeAll } = useControlEntities();

  useEffect(() => {
    read()
      .then((value) => setIsRunning(value as boolean))
      .catch((error) => console.log(error));
  }, [read]);

  const onPress = async (event: GestureResponderEvent) => {
    try {
      const nextRunningState = !isRunning;
      // write all control entities to device if it is supposed to run
      if (nextRunningState) await writeAll();

      // write next running state to device
      await write(nextRunningState);

      // call higher order press function
      if (typeof onHigherOrderPress !== 'undefined') onHigherOrderPress(event);

      // set is running state
      setIsRunning(nextRunningState);
    } catch (error) {
      console.log(error);
      renderBleErrorAlert({
        title: 'Start / Stop Error',
        message:
          'There was something wrong with starting / stopping the device.',
      });
    }
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
