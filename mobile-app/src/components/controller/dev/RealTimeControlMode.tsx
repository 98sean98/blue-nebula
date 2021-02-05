import React, { FC } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';

import { tailwind } from '@styles/tailwind';

import { ControlInterface } from '@models/ControlInterface';

import { MotorCard } from '@containers/generic/DevControllerScreen';

import { StepperMotorCard } from './StepperMotorCard';

interface RealTimeControlModeProps {
  motors: Array<MotorCard>;
}

export const RealTimeControlMode: FC<RealTimeControlModeProps> = ({
  motors,
}) => {
  const renderItem: ListRenderItem<typeof motors[0]> = ({
    item: { entity, title },
  }) => (
    <StepperMotorCard
      entity={entity}
      controlInterface={ControlInterface.RealTimeControl}
      headerParams={{ title }}
      style={[tailwind('my-2 mx-4')]}
    />
  );

  const keyExtractor = (item: MotorCard) => item.entity;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={motors}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};
