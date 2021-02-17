import React, { FC, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Divider } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { DevControlInterface } from '@models/DevControlInterface';
import { ControlEntityEnum } from '@models/control-entity';

import { MotorCard } from '@containers/main/DevControllerScreen';

import { StepperMotorCard } from './StepperMotorCard';
import {
  BleReadDeviceButton,
  BleRunIdleButton,
} from '@components/shared/bluetooth';
import {
  CreateNewControlEntityButton,
  Timer,
} from '@components/shared/actionable';

interface TestingModeProps {
  isFocused: boolean;
  motors: Array<MotorCard>;
}

export const TestingMode: FC<TestingModeProps> = ({ motors }) => {
  const renderItem: ListRenderItem<typeof motors[0]> = ({
    item: { entity, title, type },
  }) => {
    switch (type) {
      case ControlEntityEnum.StepperMotor:
        return (
          <StepperMotorCard
            entity={entity}
            controlInterface={DevControlInterface.Testing}
            headerParams={{ title }}
            style={[tailwind('my-2 mx-4')]}
          />
        );
      case ControlEntityEnum.DCMotor:
        return <></>;
    }
  };

  const keyExtractor = (item: MotorCard) => item.entity;

  const [isRunningTimer, setIsRunningTimer] = useState<boolean>(false);
  const onRunningStateChange = (newState: boolean) => {
    setIsRunningTimer(newState);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={motors}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={<CreateNewControlEntityButton />}
        ListFooterComponentStyle={tailwind('px-4 pb-3')}
      />

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
