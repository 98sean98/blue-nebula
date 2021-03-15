import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import { CardProps } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

import {
  BLDCMotor,
  Brake,
  ControlEntities,
  Enable,
} from '@models/control-entity';
import { DeclarableValueType } from '@models/ValueType';
import { DevControlInterface } from '@models/ui';

import { removeControlEntity } from '@reduxApp/control/actions';

import { ControlEntityCard } from '@components/shared/interface';
import {
  ControlEntityParameterDirection,
  ControlEntityParameterToggle,
  ResponsiveInput,
} from '@components/shared/actionable';

import { useControlEntities } from '@utilities/hooks';
import { parseFromTypeToString } from '@utilities/functions/parse';
import { tailwind } from '@styles/tailwind';

interface BLDCMotorCardProps extends Omit<CardProps, 'header'> {
  entity: keyof ControlEntities;
  controlEntity: BLDCMotor;
  controlInterface: DevControlInterface;
}

export const BLDCMotorCard: FC<BLDCMotorCardProps> = ({
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
          <View style={tailwind('flex-row justify-between')}>
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
            <ControlEntityParameterToggle
              checked={controlEntity.brake === Brake.High}
              onChange={(checked) =>
                onParameterChange(
                  'brake',
                  checked ? Brake.High.toString() : Brake.Low.toString(),
                  'number',
                )
              }
            />
          </View>
        </>
      ) : null}
    </ControlEntityCard>
  );
};
