import React, { FC, useState, useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';

import { tailwind } from '@styles/tailwind';

import { Direction, Enable } from '@models/control-entity';
import { DeclaredControlEntities } from '@config/declaredControlEntities';

import { renderBleErrorAlert } from '@components/shared/bluetooth';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';
import { Button, ButtonProps, Text } from '@ui-kitten/components';
import { RootState } from '@reduxApp/index';

import { mapStepperMotorToString } from '@utilities/functions/stepper-motor/mapStepperMotorToString';

interface StepperMotorContinuousControlButtonsProps extends ViewProps {
  entity: keyof DeclaredControlEntities;
}

const SimpleButton = (props: ButtonProps) => (
  <Button size={'small'} appearance={'ghost'} {...props} />
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
          degree: 10000,
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

  const [degree, setDegree] = useState<number>(0);
  const debounced = useDebouncedCallback(setDegree, 100, { leading: true });

  const readDegree = 50; // todo: stream read degree from ble characteristic

  useEffect(() => debounced.callback(readDegree), [debounced, readDegree]);

  return (
    <View {...props}>
      <View style={tailwind('flex-row justify-between items-center')}>
        <SimpleButton
          style={tailwind('w-16 h-10')}
          status={'info'}
          onPressIn={() => triggerContinuousRunning(true, Direction.CW)}
          onPressOut={() => triggerContinuousRunning(false, Direction.CW)}>
          CCW
        </SimpleButton>
        <View style={tailwind('items-center')}>
          <View style={tailwind('flex-row items-end')}>
            <Text category={'h6'}>{degree}</Text>
            <Text category={'s1'} style={tailwind('ml-1')}>
              deg
            </Text>
          </View>
          <SimpleButton
            style={tailwind('mt-1')}
            status={'basic'}
            onPress={() => setDegree(0)}>
            Reset
          </SimpleButton>
        </View>
        <SimpleButton
          style={tailwind('w-16 h-10')}
          status={'info'}
          onPressIn={() => triggerContinuousRunning(true, Direction.CCW)}
          onPressOut={() => triggerContinuousRunning(false, Direction.CCW)}>
          CW
        </SimpleButton>
      </View>
    </View>
  );
};
