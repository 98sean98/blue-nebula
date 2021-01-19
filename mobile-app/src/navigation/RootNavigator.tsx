import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from './navigationTypes';

import { ControllerScreen } from '@containers/generic';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: FC = () => (
  <Stack.Navigator>
    <Stack.Screen name={'Controller'} component={ControllerScreen} options={{headerTitle: 'Scraper Controller'}}/>
  </Stack.Navigator>
);
