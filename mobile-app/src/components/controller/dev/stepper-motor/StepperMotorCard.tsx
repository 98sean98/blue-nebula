import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import { CardProps } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { DeclarableValueType } from '@models/ValueType';
import { DevControlInterface } from '@models/ui';
import { ControlEntities, Enable, StepperMotor } from '@models/control-entity';

import { removeControlEntity } from '@reduxApp/control/actions';

import { ControlEntityCard } from '@components/shared/interface';
import {
  ResponsiveInput,
  ControlEntityParameterDirection,
  ControlEntityParameterToggleWithLabel,
} from '@components/shared/actionable';
import { StepperMotorContinuousControl } from './StepperMotorContinuousControl';

import { useControlEntities } from '@utilities/hooks';
import { parseFromTypeToString } from '@utilities/functions/parse';

interface StepperMotorCardProps extends Omit<CardProps, 'header'> {
  entity: keyof ControlEntities;
  controlEntity: StepperMotor;
  controlInterface: DevControlInterface;
}

export const StepperMotorCard: FC<StepperMotorCardProps> = ({
  entity,
  controlEntity,
  controlInterface,
  ...props
}) => {
  const dispatch = useDispatch();

  const { setControlEntityByParameter } = useControlEntities();

  const onParameterChange = useCallback(
    (param: string, value: string, valueType: DeclarableValueType) =>
      setControlEntityByParameter(entity, param, value, valueType),
    [entity, setControlEntityByParameter],
  );

  const headerParams = { title: controlEntity.name, subtitle: 'Stepper motor' };

  const onConfirmDelete = () => dispatch(removeControlEntity(entity));

  return (
    <ControlEntityCard
      {...props}
      headerParams={headerParams}
      onConfirmDelete={onConfirmDelete}>
      <ResponsiveInput
        keyboardType={'number-pad'}
        label={'Pulse Interval'}
        placeholder={
          'time delay between pulses in microseconds (the lower this value, the faster the motor runs)'
        }
        storedValue={controlEntity.pulseInterval}
        onInputBlur={(value) =>
          onParameterChange('pulseInterval', value || '0', 'number')
        }
      />

      {controlInterface === DevControlInterface.Testing ? (
        <ResponsiveInput
          keyboardType={'decimal-pad'}
          label={'Revolution'}
          placeholder={'rotational distance traversed by the motor'}
          storedValue={controlEntity.revolution}
          onInputBlur={(value) =>
            onParameterChange('revolution', value || '0', 'number')
          }
        />
      ) : null}

      <ResponsiveInput
        keyboardType={'number-pad'}
        label={'Pulse Per Revolution'}
        placeholder={'number of pulses per revolution'}
        storedValue={controlEntity.pulsePerRevolution}
        onInputBlur={(value) =>
          onParameterChange('pulsePerRevolution', value || '0', 'number')
        }
      />

      {controlInterface === DevControlInterface.Testing ? (
        <View style={tailwind('mt-3 flex-row justify-between items-center')}>
          <ControlEntityParameterDirection
            currentDirection={controlEntity.direction}
            onChange={(newDirection) =>
              onParameterChange(
                'direction',
                parseFromTypeToString(newDirection),
                'number',
              )
            }
          />
          <ControlEntityParameterToggleWithLabel
            toggleProps={{
              checked: controlEntity.enable === Enable.High,
              onChange: (checked) =>
                onParameterChange(
                  'enable',
                  checked ? Enable.High.toString() : Enable.Low.toString(),
                  'number',
                ),
            }}
            labelText={'Enable'}
            style={tailwind('ml-4')}
          />
        </View>
      ) : null}

      {controlInterface === DevControlInterface.RealTimeControl ? (
        <StepperMotorContinuousControl
          controlEntity={controlEntity}
          style={tailwind('mt-4 w-full')}
        />
      ) : null}
    </ControlEntityCard>
  );
};
