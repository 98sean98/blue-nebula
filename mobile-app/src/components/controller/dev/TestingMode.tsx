import React, { FC } from 'react';
import { View } from 'react-native';

import { tailwind } from '@styles/tailwind';

import { StepperMotorCard } from './StepperMotorCard';

interface TestingModeProps {}

export const TestingMode: FC<TestingModeProps> = () => {
  return (
    <View style={tailwind('mb-6')}>
      <StepperMotorCard entity={'wheelMotor'} header={{ title: 'Wheel' }} />
      <StepperMotorCard
        entity={'screwMotor'}
        header={{ title: 'Screw' }}
        style={tailwind('mt-4')}
      />
    </View>
  );
};
