import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from './navigationTypes';

import { ControllerScreen } from '@containers/generic';
import { CustomHeader } from '@navigation/CustomHeader';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: FC = () => (
  <Stack.Navigator screenOptions={{ header: CustomHeader }}>
    <Stack.Screen
      name={'Controller'}
      component={ControllerScreen}
      options={{ headerTitle: 'Scraper Controller' }}
    />
  </Stack.Navigator>
);
