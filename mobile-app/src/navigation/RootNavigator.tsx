import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from './navigationTypes';

import { HomeScreen } from '@containers/generic';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: FC = () => (
  <Stack.Navigator>
    <Stack.Screen name={'Home'} component={HomeScreen} />
  </Stack.Navigator>
);
