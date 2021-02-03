import React, { FC } from 'react';
import { View } from 'react-native';

import { tailwind } from '@styles/tailwind';

import { StepMotorCard } from './StepMotorCard';

interface TestingModeProps {}

export const TestingMode: FC<TestingModeProps> = () => {
  return (
    <View style={tailwind('mb-6')}>
      <StepMotorCard entity={'wheelMotor'} header={{ title: 'Wheel' }} />
      <StepMotorCard
        entity={'screwMotor'}
        header={{ title: 'Screw' }}
        style={tailwind('mt-4')}
      />
    </View>
  );
};
