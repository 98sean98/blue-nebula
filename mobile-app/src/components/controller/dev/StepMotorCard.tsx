import React, { FC, useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardProps, Input, Text, Button } from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';

import { tailwind } from '@styles/tailwind';

import { BluetoothValueType } from '@models/BluetoothValueType';

import { DeclaredControlEntities } from '@config/declaredControlEntities';
import { Direction } from '@config/Direction';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';

import { parseStringToType } from '@utilities/functions/parse';

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

  const [degree, setDegree] = useState<string>(
    controlEntities[entity].degree?.toString(),
  );
  const [pulseInterval, setPulseInterval] = useState<string>(
    controlEntities[entity].pulseInterval?.toString(),
  );

  const onInputBlur = () => {
    dispatch(
      setControlEntities({
        [entity]: {
          degree: parseStringToType(degree || '0', 'number'),
          pulseInterval: parseStringToType(pulseInterval || '0', 'number'),
        },
      }),
    );
  };

  const onButtonChange = (
    param: string,
    value: string,
    valueType: BluetoothValueType,
  ) => {
    dispatch(
      setControlEntities({
        [entity]: {
          [param]: parseStringToType(value, valueType),
        },
      }),
    );
  };

  useEffect(() => {
    setDegree(controlEntities[entity].degree.toString());
    setPulseInterval(controlEntities[entity].pulseInterval.toString());
  }, [controlEntities, entity]);

  const renderHeader: RenderProp<ViewProps> = (headerViewProps) => (
    <View {...headerViewProps}>
      <View style={tailwind('flex-row justify-between')}>
        <View>
          <Text category={'h4'}>{title}</Text>
          <Text category={'label'}>{subtitle ?? 'Step motor control'}</Text>
        </View>
        <View style={tailwind('flex-row items-center')}>
          <Button
            size={'small'}
            status={'info'}
            appearance={
              controlEntities[entity].direction === Direction.CW
                ? 'outline'
                : 'ghost'
            }
            onPress={() =>
              onButtonChange('direction', Direction.CW.toString(), 'number')
            }>
            CW
          </Button>
          <Button
            style={tailwind('ml-1')}
            size={'small'}
            status={'info'}
            appearance={
              controlEntities[entity].direction === Direction.CCW
                ? 'outline'
                : 'ghost'
            }
            onPress={() =>
              onButtonChange('direction', Direction.CCW.toString(), 'number')
            }>
            CCW
          </Button>
        </View>
      </View>
    </View>
  );

  return (
    <Card disabled header={renderHeader} {...props}>
      <Input
        keyboardType={'decimal-pad'}
        label={'Degree'}
        placeholder={'radial distance to be travelled by the motor'}
        value={degree}
        onChangeText={setDegree}
        onBlur={onInputBlur}
      />
      <Input
        keyboardType={'decimal-pad'}
        label={'Pulse Interval'}
        placeholder={
          'step pulse (the lower this value, the faster the motor runs)'
        }
        value={pulseInterval}
        onChangeText={setPulseInterval}
        onBlur={onInputBlur}
      />
    </Card>
  );
};
