import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { Button, ButtonProps, Text } from '@ui-kitten/components';
import { useThrottledCallback } from 'use-debounce';

import { tailwind } from '@styles/tailwind';

import { BLDCMotor, Direction, Enable } from '@models/control-entity';

import { renderBleErrorAlert } from '@components/shared/bluetooth';

import { mapControlEntityToString } from '@utilities/functions/map';
import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';
import { parseStringToNumber } from '@utilities/functions/parse';
import { generateMethodToDecipherMonitorValue } from '@utilities/functions/generateMethodToDecipherMonitorValue';

interface BLDCMotorContinuousControlProps extends ViewProps {
  controlEntity: BLDCMotor;
}

const StyledButton = (props: ButtonProps) => (
  <Button appearance={'ghost'} status={'info'} size={'large'} {...props} />
);

export const BLDCMotorContinuousControl: FC<BLDCMotorContinuousControlProps> = ({
  controlEntity,
  ...props
}) => {
  const {
    write: writeBldcMotor,
    monitor: monitorBLDCMotor,
  } = useBleRpiDeviceCharacteristic('bldcMotors', 'string');
  const { write: writeRunIdle } = useBleRpiDeviceCharacteristic(
    'runIdle',
    'boolean',
  );

  const [isControlDisabled, setIsControlDisabled] = useState<boolean>(false);

  const triggerContinuousRunning = useCallback(
    async (isRunning: boolean, direction: Direction) => {
      try {
        if (isRunning) {
          const stringValue = mapControlEntityToString({
            ...controlEntity,
            direction,
            enable: Enable.High,
            duration: 200, // arbitrarily large duration number
          });
          await writeBldcMotor(stringValue);
          await writeRunIdle(true);
          monitorBLDCMotor.start(
            generateMethodToDecipherMonitorValue(controlEntity.name, 3),
          );
        } else {
          // disable the controls for a short while
          setIsControlDisabled(true);
          monitorBLDCMotor.stop();
          const stringValue = mapControlEntityToString({
            ...controlEntity,
            enable: Enable.Low,
          });
          await writeRunIdle(false);
          await writeBldcMotor(stringValue);
        }
      } catch (error) {
        console.log(error);
        renderBleErrorAlert({
          title: 'Continuous Running Trigger Error',
          message:
            'There was an error with sending data to instantaneous start and stop.',
        });
      }
    },
    [controlEntity, writeBldcMotor, monitorBLDCMotor, writeRunIdle],
  );

  useEffect(() => {
    if (isControlDisabled) {
      const timeout = setTimeout(() => setIsControlDisabled(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [isControlDisabled]);

  const [speedRpm, setSpeedRpm] = useState<number>(0);
  const throttledSetSpeedRpm = useThrottledCallback(setSpeedRpm, 100);
  const [shouldStreamMonitor, setShouldStreamMonitor] = useState<boolean>(
    false,
  );

  useEffect(() => {
    if (monitorBLDCMotor.isMonitoring) {
      const timeout = setTimeout(() => setShouldStreamMonitor(true), 1000);
      return () => clearTimeout(timeout);
    } else setShouldStreamMonitor(false);
  }, [monitorBLDCMotor.isMonitoring]);

  useEffect(() => {
    if (shouldStreamMonitor && typeof monitorBLDCMotor.value !== 'undefined') {
      const stringArray = (monitorBLDCMotor.value as string).split(', ');
      const readSpeedRpm = parseStringToNumber(stringArray[1]);
      if (typeof readSpeedRpm !== 'undefined')
        throttledSetSpeedRpm.callback(readSpeedRpm);
    } else {
      // make sure to flush any pending calls first before updating the previous value
      throttledSetSpeedRpm.flush();
      setSpeedRpm(0);
    }
  }, [
    shouldStreamMonitor,
    monitorBLDCMotor.value,
    setSpeedRpm,
    throttledSetSpeedRpm,
  ]);

  return (
    <View
      {...props}
      style={[
        tailwind('flex-row justify-between items-center'),
        props?.style ?? {},
      ]}>
      <StyledButton
        style={tailwind('w-1/3')}
        disabled={isControlDisabled}
        onPressIn={() => triggerContinuousRunning(true, Direction.CCW)}
        onPressOut={() => triggerContinuousRunning(false, Direction.CCW)}>
        CCW
      </StyledButton>
      <View style={tailwind('w-1/4 flex-row justify-center items-end')}>
        <Text category={'h6'}>{speedRpm}</Text>
        <Text category={'s1'} style={tailwind('ml-1')}>
          rpm
        </Text>
      </View>
      <StyledButton
        style={tailwind('w-1/3')}
        disabled={isControlDisabled}
        onPressIn={() => triggerContinuousRunning(true, Direction.CW)}
        onPressOut={() => triggerContinuousRunning(false, Direction.CW)}>
        CW
      </StyledButton>
    </View>
  );
};
