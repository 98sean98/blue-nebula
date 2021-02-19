import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { BuilderStackParamList, SetupsMode } from './navigationTypes';

import { CustomHeader } from './CustomHeader';

import {
  NewControlEntityScreen,
  SetupFormScreen,
  SetupsScreen,
} from '@containers/builder';

const Stack = createStackNavigator<BuilderStackParamList>();

export const Builder: FC = () => (
  <Stack.Navigator
    screenOptions={{ header: (props) => <CustomHeader {...props} /> }}>
    <Stack.Screen
      name={'NewControlEntity'}
      component={NewControlEntityScreen}
      options={{ headerTitle: 'New Control Entity' }}
    />
    <Stack.Screen
      name={'Setups'}
      component={SetupsScreen}
      initialParams={{ mode: SetupsMode.Normal }}
    />
    <Stack.Screen name={'SetupForm'} component={SetupFormScreen} />
  </Stack.Navigator>
);
