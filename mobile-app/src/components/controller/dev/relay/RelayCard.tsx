import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import { CardProps } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import {
  ControlEntities,
  Enable,
  GPIOState,
  Relay,
} from '@models/control-entity';
import { DevControlInterface } from '@models/ui';
import { DeclarableValueType } from '@models/ValueType';

import { removeControlEntity } from '@reduxApp/control/actions';

import { ControlEntityCard } from '@components/shared/interface';
import {
  ControlEntityParameterToggleWithLabel,
  ResponsiveInput,
} from '@components/shared/actionable';
import { RelayContinuousControl } from './RelayContinuousControl';

import { useControlEntities } from '@utilities/hooks';
import { parseFromTypeToString } from '@utilities/functions/parse';

interface RelayCardProps extends Omit<CardProps, 'header'> {
  entity: keyof ControlEntities;
  controlEntity: Relay;
  controlInterface: DevControlInterface;
}

export const RelayCard: FC<RelayCardProps> = ({
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

  const headerParams = { title: controlEntity.name, subtitle: 'Relay' };

  const onConfirmDelete = () => dispatch(removeControlEntity(entity));

  return (
    <ControlEntityCard
      headerParams={headerParams}
      onConfirmDelete={onConfirmDelete}
      {...props}>
      {controlInterface === DevControlInterface.Testing ? (
        <>
          <ResponsiveInput
            keyboardType={'decimal-pad'}
            label={'Duration'}
            placeholder={'relay running duration'}
            storedValue={controlEntity.duration}
            onInputBlur={(value) =>
              onParameterChange('duration', value || '0', 'number')
            }
          />
          <View style={tailwind('mt-3 flex-row justify-between items-center')}>
            <ControlEntityParameterToggleWithLabel
              toggleProps={{
                checked: controlEntity.gpioState === GPIOState.High,
                onChange: (checked) =>
                  onParameterChange(
                    'gpioState',
                    checked
                      ? GPIOState.High.toString()
                      : GPIOState.Low.toString(),
                    'number',
                  ),
              }}
              labelText={'GPIO State'}
            />
            <ControlEntityParameterToggleWithLabel
              toggleProps={{
                checked: controlEntity.permanentChange,
                onChange: (checked) =>
                  onParameterChange(
                    'permanentChange',
                    parseFromTypeToString(checked),
                    'boolean',
                  ),
              }}
              labelText={'Permanent Change'}
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
            />
          </View>
        </>
      ) : null}

      {controlInterface === DevControlInterface.RealTimeControl ? (
        <RelayContinuousControl controlEntity={controlEntity} />
      ) : null}
    </ControlEntityCard>
  );
};
