import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MainStackParamList } from './navigationTypes';

import { CustomHeader } from './CustomHeader';

import {
  DevControllerScreen,
  SettingsScreen,
  SimpleControllerScreen,
} from '@containers/main';

const Stack = createStackNavigator<MainStackParamList>();

export const Main: FC = () => (
  <Stack.Navigator
    screenOptions={{ header: (props) => <CustomHeader {...props} /> }}
    initialRouteName={'SimpleController'}>
    <Stack.Screen
      name={'DevController'}
      component={DevControllerScreen}
      options={{ headerTitle: 'Developer Controller' }}
    />
    <Stack.Screen
      name={'SimpleController'}
      component={SimpleControllerScreen}
      options={{ headerTitle: 'Simple Controller' }}
    />
    <Stack.Screen name={'Settings'} component={SettingsScreen} />
  </Stack.Navigator>
);
