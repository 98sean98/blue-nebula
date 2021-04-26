import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import { CardProps } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { DCMotor, ControlEntities, Enable } from '@models/control-entity';
import { DeclarableValueType } from '@models/ValueType';
import { DevControlInterface } from '@models/ui';

import { removeControlEntity } from '@reduxApp/control/actions';

import { ControlEntityCard } from '@components/shared/interface';
import {
  ControlEntityParameterDirection,
  ControlEntityParameterToggleWithLabel,
  ResponsiveInput,
} from '@components/shared/actionable';
import { DCMotorContinuousControl } from './DCMotorContinuousControl';

import { useControlEntities } from '@utilities/hooks';
import { parseFromTypeToString } from '@utilities/functions/parse';

interface DCMotorCardProps extends Omit<CardProps, 'header'> {
  entity: keyof ControlEntities;
  controlEntity: DCMotor;
  controlInterface: DevControlInterface;
}

export const DCMotorCard: FC<DCMotorCardProps> = ({
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

  const headerParams = { title: controlEntity.name };

  const onConfirmDelete = () => dispatch(removeControlEntity(entity));

  return (
    <ControlEntityCard
      {...props}
      headerParams={headerParams}
      onConfirmDelete={onConfirmDelete}>
      <ResponsiveInput
        keyboardType={'decimal-pad'}
        label={'PWM Duty Cycle'}
        placeholder={'pwm output (0 - 100)'}
        storedValue={controlEntity.pwmDutyCycle}
        onInputBlur={(value) =>
          onParameterChange('pwmDutyCycle', value || '0', 'number')
        }
      />
      <ResponsiveInput
        keyboardType={'number-pad'}
        label={'PWM Frequency'}
        placeholder={'cycle frequency (should be around 1000)'}
        storedValue={controlEntity.pwmFrequency}
        onInputBlur={(value) =>
          onParameterChange('pwmFrequency', value || '0', 'number')
        }
      />

      {controlInterface === DevControlInterface.Testing ? (
        <>
          <ResponsiveInput
            keyboardType={'decimal-pad'}
            label={'Duration'}
            placeholder={'motor running duration'}
            storedValue={controlEntity.duration}
            onInputBlur={(value) =>
              onParameterChange('duration', value || '0', 'number')
            }
          />
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
        </>
      ) : null}

      {controlInterface === DevControlInterface.RealTimeControl ? (
        <DCMotorContinuousControl
          controlEntity={controlEntity}
          style={tailwind('mt-4 w-full')}
        />
      ) : null}
    </ControlEntityCard>
  );
};
