import React, { FC, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Divider } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { StepperMotorCard } from './StepperMotorCard';
import {
  BleReadDeviceButton,
  BleRunIdleButton,
} from '@components/shared/bluetooth';
import { Timer } from '@components/shared/actionable';

import { DeclaredControlEntities } from '@config/declaredControlEntities';

type Motor = {
  entity: keyof DeclaredControlEntities;
  title: string;
};

interface TestingModeProps {}

export const TestingMode: FC<TestingModeProps> = () => {
  const motors: Array<Motor> = [
    { entity: 'wheelMotor', title: 'Wheel' },
    { entity: 'screwMotor', title: 'Screw' },
  ];

  const renderItem: ListRenderItem<Motor> = ({ item: { entity, title } }) => (
    <StepperMotorCard
      entity={entity}
      header={{ title }}
      style={[tailwind('my-2 mx-4')]}
    />
  );

  const keyExtractor = (item: Motor) => item.entity;

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
