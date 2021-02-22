import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from './navigationTypes';

import { Main } from './main';
import { Builder } from './builder';

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

export const RootNavigator: FC = () => (
  <Navigator mode={'modal'} initialRouteName={'Main'}>
    <Screen name={'Main'} component={Main} />
    <Screen
      name={'Builder'}
      component={Builder}
      options={{ headerShown: false }}
    />
  </Navigator>
);
