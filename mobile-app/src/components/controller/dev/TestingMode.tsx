import React, { FC, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Divider } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { ControlInterface } from '@models/ControlInterface';

import { MotorCard } from '@containers/generic/DevControllerScreen';

import { StepperMotorCard } from './StepperMotorCard';
import {
  BleReadDeviceButton,
  BleRunIdleButton,
} from '@components/shared/bluetooth';
import { Timer } from '@components/shared/actionable';

interface TestingModeProps {
  motors: Array<MotorCard>;
}

export const TestingMode: FC<TestingModeProps> = ({ motors }) => {
  const renderItem: ListRenderItem<typeof motors[0]> = ({
    item: { entity, title },
  }) => (
    <StepperMotorCard
      entity={entity}
      controlInterface={ControlInterface.Testing}
      headerParams={{ title }}
      style={[tailwind('my-2 mx-4')]}
    />
  );

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
