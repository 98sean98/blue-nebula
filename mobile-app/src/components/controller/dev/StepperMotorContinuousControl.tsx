import React, { FC, useState, useEffect, useMemo } from 'react';
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

import { mapControlEntityToString } from '@utilities/functions/map';
import { parseStringToNumber } from '@utilities/functions/parse';

interface StepperMotorContinuousControlProps extends ViewProps {
  entity: keyof DeclaredControlEntities;
}

const GhostButton = (props: ButtonProps) => (
  <Button appearance={'ghost'} {...props} />
);

const generateMethodToDecipherMonitorValue = (entityName: string) => (
  rawValue: string,
): string => {
  const stringArray = rawValue.split(', ');
  const entityNameIndex = stringArray.findIndex((e) => e === entityName);
  return stringArray.slice(entityNameIndex, entityNameIndex + 3).join(', ');
};

export const StepperMotorContinuousControl: FC<StepperMotorContinuousControlProps> = ({
  entity,
  ...props
}) => {
  const { controlEntities } = useSelector((state: RootState) => state.control);
  const controlEntityObject = useMemo(() => controlEntities[entity], [
    controlEntities,
    entity,
  ]);

  const {
    write: writeStepperMotor,
    monitor: monitorStepperMotor,
  } = useBleRpiDeviceCharacteristic('stepperMotors', 'string');
  const { write: WriteRunIdle } = useBleRpiDeviceCharacteristic(
    'runIdle',
    'boolean',
  );

  const [isControlDisabled, setIsControlDisabled] = useState<boolean>(false);

  const triggerContinuousRunning = async (
    isRunning: boolean,
    direction: Direction,
  ) => {
    try {
      if (isRunning) {
        const stringValue = mapControlEntityToString({
          ...controlEntityObject,
          revolution: 2000, // arbitrarily large revolution number
          direction,
          enable: Enable.High,
        });
        await writeStepperMotor(stringValue);
        monitorStepperMotor.start(
          generateMethodToDecipherMonitorValue(controlEntityObject.name),
        );
        await WriteRunIdle(true);
      } else {
        // disable the controls for a short while
        setIsControlDisabled(true);
        await WriteRunIdle(false);
        monitorStepperMotor.stop();
        const stringValue = mapControlEntityToString({
          ...controlEntityObject,
          enable: Enable.Low,
        });
        await writeStepperMotor(stringValue);
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

  useEffect(() => {
    if (isControlDisabled) {
      const timeout = setTimeout(() => setIsControlDisabled(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [isControlDisabled]);

  const [revolution, setRevolution] = useState<{
    current: number;
    previous: number;
  }>({ current: 0, previous: 0 });
  const throttledSetRevolution = useThrottledCallback(setRevolution, 100, {});
  const [shouldStreamMonitor, setShouldStreamMonitor] = useState<boolean>(
    false,
  );

  useEffect(() => {
    if (monitorStepperMotor.isMonitoring) {
      const timeout = setTimeout(() => setShouldStreamMonitor(true), 800);
      return () => clearTimeout(timeout);
    } else setShouldStreamMonitor(false);
  }, [monitorStepperMotor.isMonitoring]);

  useEffect(() => {
    if (
      shouldStreamMonitor &&
      typeof monitorStepperMotor.value !== 'undefined'
    ) {
      const stringArray = (monitorStepperMotor.value as string).split(', ');
      const readRevolution = parseStringToNumber(stringArray[1]);
      if (typeof readRevolution !== 'undefined')
        throttledSetRevolution.callback((thisRevolution) => ({
          ...thisRevolution,
          current:
            Math.round((readRevolution + thisRevolution.previous) * 10) / 10,
        }));
    } else
      setRevolution((thisRevolution) => ({
        ...thisRevolution,
        previous: thisRevolution.current,
      }));
  }, [
    shouldStreamMonitor,
    monitorStepperMotor.value,
    setRevolution,
    throttledSetRevolution,
  ]);

  const onResetPress = () => setRevolution({ current: 0, previous: 0 });

  return (
    <View {...props}>
      <View style={tailwind('flex-row justify-between items-center')}>
        <GhostButton
          status={'info'}
          size={'large'}
          style={tailwind('ml-1 w-20')}
          disabled={isControlDisabled}
          onPressIn={() => triggerContinuousRunning(true, Direction.CW)}
          onPressOut={() => triggerContinuousRunning(false, Direction.CW)}>
          CCW
        </GhostButton>
        <View style={tailwind('items-center mx-2')}>
          <View style={tailwind('flex-row items-end')}>
            <Text category={'h6'}>{revolution.current}</Text>
            <Text category={'s1'} style={tailwind('ml-1')}>
              rev
            </Text>
          </View>
          <GhostButton
            style={tailwind('mt-1')}
            status={'basic'}
            size={'small'}
            onPress={onResetPress}>
            Reset
          </GhostButton>
        </View>
        <GhostButton
          status={'info'}
          size={'large'}
          style={tailwind('w-20')}
          disabled={isControlDisabled}
          onPressIn={() => triggerContinuousRunning(true, Direction.CCW)}
          onPressOut={() => triggerContinuousRunning(false, Direction.CCW)}>
          CW
        </GhostButton>
      </View>
    </View>
  );
};
