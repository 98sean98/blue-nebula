import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from './navigationTypes';

import { Main } from './main';
import { Builder } from './builder';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: FC = () => (
  <Stack.Navigator
    mode={'modal'}
    screenOptions={{ headerShown: false }}
    initialRouteName={'Main'}>
    <Stack.Screen name={'Main'} component={Main} />
    <Stack.Screen name={'Builder'} component={Builder} />
  </Stack.Navigator>
);
