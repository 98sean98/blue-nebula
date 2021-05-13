import React, {
  ComponentProps,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { View, ViewProps } from 'react-native';

import { tailwind } from '@styles/tailwind';

import { Enable, GPIOState, Relay } from '@models/control-entity';

import { ResponsiveButton } from '@components/shared/actionable';
import { renderBleErrorAlert } from '@components/shared/bluetooth';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';
import { mapControlEntityToString } from '@utilities/functions/map';

interface RelayContinuousControlProps extends ViewProps {
  controlEntity: Relay;
}

const StyledButton = (props: ComponentProps<typeof ResponsiveButton>) => (
  <ResponsiveButton status={'info'} size={'large'} {...props} />
);

export const RelayContinuousControl: FC<RelayContinuousControlProps> = ({
  controlEntity,
  ...props
}) => {
  const { write: writeRelays } = useBleRpiDeviceCharacteristic(
    'relays',
    'string',
  );
  const { write: writeRunIdle } = useBleRpiDeviceCharacteristic(
    'runIdle',
    'boolean',
  );

  const [gpioState, setGPIOState] = useState<GPIOState>();
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const onStatePress = useCallback(
    async (newGPIOState: Relay['gpioState']) => {
      try {
        // write the commands
        const stringValue = mapControlEntityToString({
          ...controlEntity,
          gpioState: newGPIOState,
          permanentChange: true,
          enable: Enable.High,
        });
        await writeRelays(stringValue);
        await writeRunIdle(true);
        setIsRunning(true);
        setGPIOState(newGPIOState);
      } catch (error) {
        console.log(error);
        renderBleErrorAlert({
          title: 'Continuous Running Trigger Error',
          message:
            'There was an error with sending data to instantaneous start and stop.',
        });
      }
    },
    [controlEntity, writeRelays, writeRunIdle],
  );

  useEffect(() => {
    if (isRunning) {
      const timeout = setTimeout(async () => {
        try {
          await writeRunIdle(false);
        } catch (error) {
          console.log(error);
        } finally {
          setIsRunning(false);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isRunning, writeRunIdle]);

  // set gpio state according to the control entity's state
  useEffect(() => {
    setGPIOState(controlEntity.gpioState);
  }, [controlEntity.gpioState]);

  return (
    <View
      {...props}
      style={[
        tailwind('flex-row justify-evenly items-center'),
        props?.style ?? {},
      ]}>
      <StyledButton
        isSelected={gpioState === GPIOState.Low}
        onSelected={() => onStatePress(GPIOState.Low)}
        disabled={isRunning}>
        Low
      </StyledButton>
      <StyledButton
        isSelected={gpioState === GPIOState.High}
        onSelected={() => onStatePress(GPIOState.High)}
        disabled={isRunning}>
        High
      </StyledButton>
    </View>
  );
};
