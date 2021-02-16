import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from './navigationTypes';

import { CustomHeader } from '@navigation/CustomHeader';
import {
  DevControllerScreen,
  SettingsScreen,
  SimpleControllerScreen,
} from '@containers/generic';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: FC = () => (
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
