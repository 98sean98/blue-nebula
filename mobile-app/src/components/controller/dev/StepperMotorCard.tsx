import React, { ComponentProps, FC, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { DeclarableValueType } from '@models/ValueType';
import { DevControlInterface } from '@models/DevControlInterface';
import {
  Direction,
  Enable,
  ControlEntities,
  StepperMotor,
} from '@models/control-entity';

import { RootState } from '@reduxApp';

import { ControlEntityCard } from '@components/shared/interface';
import {
  ControlEntityParameterButton,
  ControlEntityParameterInput,
  ControlEntityParameterToggle,
} from '@components/shared/actionable';
import { StepperMotorContinuousControl } from './StepperMotorContinuousControl';

import { useControlEntities } from '@utilities/hooks';
import { parseFromTypeToString } from '@utilities/functions/parse';

interface StepperMotorCardProps
  extends ComponentProps<typeof ControlEntityCard> {
  entity: keyof ControlEntities;
  controlInterface: DevControlInterface;
}

export const StepperMotorCard: FC<StepperMotorCardProps> = ({
  entity,
  controlInterface,
  ...props
}) => {
  const { controlEntities } = useSelector((state: RootState) => state.control);
  const controlEntity = useMemo(() => controlEntities[entity] as StepperMotor, [
    controlEntities,
    entity,
  ]);

  const { setControlEntityByParameter } = useControlEntities();

  const onParameterChange = useCallback(
    (param: string, value: string, valueType: DeclarableValueType) =>
      setControlEntityByParameter(entity, param, value, valueType),
    [entity, setControlEntityByParameter],
  );

  return (
    <ControlEntityCard {...props}>
      <ControlEntityParameterInput
        keyboardType={'number-pad'}
        label={'Pulse Interval'}
        placeholder={
          'time delay between pulses in microseconds (the lower this value, the faster the motor runs)'
        }
        reduxValue={controlEntity.pulseInterval}
        onInputBlur={(value) =>
          onParameterChange('pulseInterval', value || '0', 'number')
        }
      />

      {controlInterface === DevControlInterface.Testing ? (
        <ControlEntityParameterInput
          keyboardType={'decimal-pad'}
          label={'Revolution'}
          placeholder={'rotational distance traversed by the motor'}
          reduxValue={controlEntity.revolution}
          onInputBlur={(value) =>
            onParameterChange('revolution', value || '0', 'number')
          }
        />
      ) : null}

      <ControlEntityParameterInput
        keyboardType={'number-pad'}
        label={'Pulse Per Revolution'}
        placeholder={'number of pulses per revolution'}
        reduxValue={controlEntity.pulsePerRevolution}
        onInputBlur={(value) =>
          onParameterChange('pulsePerRevolution', value || '0', 'number')
        }
      />

      {controlInterface === DevControlInterface.Testing ? (
        <View style={tailwind('mt-3 flex-row justify-between items-center')}>
          <View style={tailwind('flex-row items-center')}>
            <ControlEntityParameterButton
              isSelected={controlEntity.direction === Direction.CCW}
              onSelected={() =>
                onParameterChange(
                  'direction',
                  parseFromTypeToString(Direction.CCW),
                  'number',
                )
              }>
              CCW
            </ControlEntityParameterButton>
            <ControlEntityParameterButton
              isSelected={controlEntity.direction === Direction.CW}
              onSelected={() =>
                onParameterChange(
                  'direction',
                  parseFromTypeToString(Direction.CW),
                  'number',
                )
              }>
              CW
            </ControlEntityParameterButton>
          </View>
          <View style={tailwind('ml-4 items-center')}>
            <ControlEntityParameterToggle
              checked={controlEntity.enable === Enable.High}
              onChange={(checked) =>
                onParameterChange(
                  'enable',
                  checked ? Enable.High.toString() : Enable.Low.toString(),
                  'number',
                )
              }
            />
            <Text
              category={'label'}
              appearance={'hint'}
              style={tailwind('mt-1')}>
              Enable
            </Text>
          </View>
        </View>
      ) : null}

      {controlInterface === DevControlInterface.RealTimeControl ? (
        <StepperMotorContinuousControl
          entity={entity}
          style={tailwind('mt-4 w-full')}
        />
      ) : null}
    </ControlEntityCard>
  );
};
