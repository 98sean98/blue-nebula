import React, { FC, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Divider, Layout } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import {
  BLDCMotor,
  ControlEntityEnum,
  DCMotor,
  Relay,
  StepperMotor,
} from '@models/control-entity';
import { DevControlInterface } from '@models/ui';

import { RootState } from '@reduxApp';

import { StepperMotorCard } from './stepper-motor';
import { DCMotorCard } from './dc-motor';
import { BLDCMotorCard } from './bldc-motor';
import { RelayCard } from './relay';
import {
  BleReadDeviceButton,
  BleRunIdleButton,
} from '@components/shared/bluetooth';
import { Stopwatch } from '@components/shared/actionable';
import { PlatformKeyboardAvoidingView } from '@components/shared/interface';

interface TestingModeProps {
  isFocused: boolean;
}

export const TestingMode: FC<TestingModeProps> = () => {
  const { controlEntities } = useSelector((state: RootState) => state.control);

  const data = useMemo(
    () =>
      Object.entries(controlEntities).map(([entity, controlEntity]) => ({
        entity,
        controlEntity,
      })),
    [controlEntities],
  );

  const renderItem: ListRenderItem<typeof data[0]> = ({
    item: { entity, controlEntity },
  }) => {
    switch (controlEntity.type) {
      case ControlEntityEnum.StepperMotor:
        return (
          <StepperMotorCard
            entity={entity}
            controlEntity={controlEntity as StepperMotor}
            controlInterface={DevControlInterface.Testing}
            style={tailwind('my-2 mx-4')}
          />
        );
      case ControlEntityEnum.DCMotor:
        return (
          <DCMotorCard
            entity={entity}
            controlEntity={controlEntity as DCMotor}
            controlInterface={DevControlInterface.Testing}
            style={tailwind('my-2 mx-4')}
          />
        );
      case ControlEntityEnum.BLDCMotor:
        return (
          <BLDCMotorCard
            entity={entity}
            controlEntity={controlEntity as BLDCMotor}
            controlInterface={DevControlInterface.Testing}
            style={tailwind('my-2 mx-4')}
          />
        );
      case ControlEntityEnum.Relay:
        return (
          <RelayCard
            entity={entity}
            controlEntity={controlEntity as Relay}
            controlInterface={DevControlInterface.Testing}
            style={tailwind('my-2 mx-4')}
          />
        );
    }
  };

  const keyExtractor = (item: typeof data[0]) => item.entity;

  const [isRunningTimer, setIsRunningTimer] = useState<boolean>(false);
  const onRunningStateChange = (newState: boolean) =>
    setIsRunningTimer(newState);

  return (
    <View style={{ flex: 1 }}>
      <PlatformKeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={150}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </PlatformKeyboardAvoidingView>

      <Divider />

      <Layout style={tailwind('w-full py-1 px-3')} level={'2'}>
        <Stopwatch
          shouldRun={isRunningTimer}
          style={tailwind('w-2/3 self-center')}
          level={'2'}
        />
        <View style={tailwind('mt-2 flex-row justify-between')}>
          <BleReadDeviceButton style={{ width: '49%' }} />
          <BleRunIdleButton
            style={{ width: '49%' }}
            showVerbose
            onStateChange={onRunningStateChange}
          />
        </View>
      </Layout>
    </View>
  );
};
