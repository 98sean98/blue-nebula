import React, { FC, useState, useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import { Button, ButtonProps, Text } from '@ui-kitten/components';
import { useSelector } from 'react-redux';
import { useThrottledCallback } from 'use-debounce';

import { tailwind } from '@styles/tailwind';

import { Direction, Enable } from '@models/control-entity';
import { DeclaredControlEntities } from '@config/declaredControlEntities';

import { RootState } from '@reduxApp';

import { renderBleErrorAlert } from '@components/shared/bluetooth';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';

import { mapStepperMotorToString } from '@utilities/functions/stepper-motor/mapStepperMotorToString';

interface StepperMotorContinuousControlButtonsProps extends ViewProps {
  entity: keyof DeclaredControlEntities;
}

const GhostButton = (props: ButtonProps) => (
  <Button appearance={'ghost'} {...props} />
);

export const StepperMotorContinuousControlButtons: FC<StepperMotorContinuousControlButtonsProps> = ({
  entity,
  ...props
}) => {
  const { controlEntities } = useSelector((state: RootState) => state.control);
  const controlEntityObject = controlEntities[entity];

  const { write: writeStepMotor } = useBleRpiDeviceCharacteristic(
    'stepMotors',
    'string',
  );
  const { write: WriteRunIdle } = useBleRpiDeviceCharacteristic(
    'runIdle',
    'boolean',
  );

  const triggerContinuousRunning = async (
    isRunning: boolean,
    direction: Direction,
  ) => {
    try {
      if (isRunning) {
        const stringValue = mapStepperMotorToString({
          ...controlEntityObject,
          revolution: 20,
          direction,
          enable: Enable.High,
        });
        await writeStepMotor(stringValue);
        await WriteRunIdle(true);
      } else {
        await WriteRunIdle(false);
        const stringValue = mapStepperMotorToString({
          ...controlEntityObject,
          enable: Enable.Low,
        });
        await writeStepMotor(stringValue);
      }
    } catch (error) {
      console.log(error);
      renderBleErrorAlert({
        title: 'Continuous Running Trigger Error',
        message:
          'There was an error with sending data to instantaneous start and stop.',
      });
    }
  };

  const [revolution, setRevolution] = useState<number>(0);
  const throttledSetRevolution = useThrottledCallback(setRevolution, 70, {
    leading: true,
  });

  const streamedRevolution = 50; // todo: stream read revolution from ble characteristic

  useEffect(() => throttledSetRevolution.callback(streamedRevolution), [
    throttledSetRevolution,
    streamedRevolution,
  ]);

  return (
    <View {...props}>
      <View style={tailwind('flex-row justify-between items-center')}>
        <GhostButton
          status={'info'}
          size={'large'}
          onPressIn={() => triggerContinuousRunning(true, Direction.CW)}
          onPressOut={() => triggerContinuousRunning(false, Direction.CW)}>
          CCW
        </GhostButton>
        <View style={tailwind('items-center')}>
          <View style={tailwind('flex-row items-end')}>
            <Text category={'h6'}>{revolution}</Text>
            <Text category={'s1'} style={tailwind('ml-1')}>
              rev
            </Text>
          </View>
          <GhostButton
            style={tailwind('mt-1')}
            status={'basic'}
            size={'small'}
            onPress={() => setRevolution(0)}>
            Reset
          </GhostButton>
        </View>
        <GhostButton
          status={'info'}
          size={'large'}
          onPressIn={() => triggerContinuousRunning(true, Direction.CCW)}
          onPressOut={() => triggerContinuousRunning(false, Direction.CCW)}>
          CW
        </GhostButton>
      </View>
    </View>
  );
};
