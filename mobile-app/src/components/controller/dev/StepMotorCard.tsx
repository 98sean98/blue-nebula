import React, { FC } from 'react';
import { View, ViewProps } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardProps, Text } from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';

import { tailwind } from '@styles/tailwind';

import { DeclarableValueType } from '@models/ValueType';

import { DeclaredControlEntities } from '@config/declaredControlEntities';
import { Direction } from '@config/Direction';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';

import {
  ControlEntityParameterButton,
  ControlEntityParameterInput,
} from '@components/shared/actionable';

import {
  parseFromTypeToString,
  parseStringToType,
} from '@utilities/functions/parse';

interface StepMotorCardProps extends Omit<CardProps, 'header'> {
  entity: keyof DeclaredControlEntities;
  header: { title: string; subtitle?: string };
}

export const StepMotorCard: FC<StepMotorCardProps> = ({
  entity,
  header: { title, subtitle },
  ...props
}) => {
  const dispatch = useDispatch();

  const { controlEntities } = useSelector((state: RootState) => state.control);

  const onParameterChange = (
    param: string,
    value: string,
    valueType: DeclarableValueType,
  ) => {
    dispatch(
      setControlEntities({
        [entity]: {
          [param]: parseStringToType(value, valueType),
        },
      }),
    );
  };

  const renderHeader: RenderProp<ViewProps> = (headerViewProps) => (
    <View {...headerViewProps}>
      <View style={tailwind('flex-row justify-between')}>
        <View>
          <Text category={'h4'}>{title}</Text>
          <Text category={'label'}>{subtitle ?? 'Step motor control'}</Text>
        </View>
        <View style={tailwind('flex-row items-center')}>
          <ControlEntityParameterButton
            isSelected={controlEntities[entity].direction === Direction.CW}
            onSelected={() =>
              onParameterChange(
                'direction',
                parseFromTypeToString(Direction.CW),
                'number',
              )
            }>
            CW
          </ControlEntityParameterButton>
          <ControlEntityParameterButton
            style={tailwind('ml-1')}
            isSelected={controlEntities[entity].direction === Direction.CCW}
            onSelected={() =>
              onParameterChange(
                'direction',
                parseFromTypeToString(Direction.CCW),
                'number',
              )
            }>
            CCW
          </ControlEntityParameterButton>
        </View>
      </View>
    </View>
  );

  return (
    <Card disabled header={renderHeader} {...props}>
      <ControlEntityParameterInput
        keyboardType={'decimal-pad'}
        label={'Degree'}
        placeholder={'radial distance to be travelled by the motor'}
        reduxValue={controlEntities[entity].degree}
        onInputBlur={(value) =>
          onParameterChange('degree', value || '0', 'number')
        }
      />
      <ControlEntityParameterInput
        keyboardType={'decimal-pad'}
        label={'Pulse Interval'}
        placeholder={
          'step pulse (the lower this value, the faster the motor runs)'
        }
        reduxValue={controlEntities[entity].pulseInterval}
        onInputBlur={(value) =>
          onParameterChange('pulseInterval', value || '0', 'number')
        }
      />
    </Card>
  );
};
