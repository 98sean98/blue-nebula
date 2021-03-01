import React, { FC, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  View,
} from 'react-native';
import { Divider } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { SetupsMode } from '@navigation/main';

import { ControlEntityEnum, StepperMotor } from '@models/control-entity';
import { DevControlInterface } from '@models/ui';

import { RootState } from '@reduxApp';

import { StepperMotorCard } from './StepperMotorCard';
import {
  BleReadDeviceButton,
  BleRunIdleButton,
} from '@components/shared/bluetooth';
import {
  NavigateToNewControlEntityButton,
  NavigateToSetupsButton,
  Timer,
} from '@components/shared/actionable';
import { renderIcon } from '@components/shared/interface';

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
            style={[tailwind('my-2 mx-4')]}
          />
        );
      case ControlEntityEnum.DCMotor:
        return <></>;
    }
  };

  const keyExtractor = (item: typeof data[0]) => item.entity;

  const listFooterComponent = useMemo(
    () => (
      <View style={tailwind('w-full flex-row justify-between')}>
        <NavigateToNewControlEntityButton
          style={{ width: '49%' }}
          status={'info'}
        />
        <NavigateToSetupsButton
          mode={SetupsMode.SavingNew}
          accessoryLeft={renderIcon('save-outline')}
          status={'info'}
          style={{ width: '49%' }}>
          Save Setup
        </NavigateToSetupsButton>
      </View>
    ),
    [],
  );

  const [isRunningTimer, setIsRunningTimer] = useState<boolean>(false);
  const onRunningStateChange = (newState: boolean) =>
    setIsRunningTimer(newState);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={'padding'}
        keyboardVerticalOffset={150}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListFooterComponent={listFooterComponent}
          ListFooterComponentStyle={tailwind('px-4 pb-3')}
        />
      </KeyboardAvoidingView>

      <Divider />

      <View style={tailwind('my-1 mx-3')}>
        <Timer
          shouldRun={isRunningTimer}
          style={tailwind('w-2/3 self-center')}
        />
        <View style={tailwind('mt-2 flex-row justify-between')}>
          <BleReadDeviceButton style={{ width: '49%' }} />
          <BleRunIdleButton
            style={{ width: '49%' }}
            showVerbose
            onStateChange={onRunningStateChange}
          />
        </View>
      </View>
    </View>
  );
};
