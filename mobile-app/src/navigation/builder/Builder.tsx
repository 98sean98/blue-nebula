import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { BuilderStackParamList } from './navigationTypes';

import { CustomHeader } from './CustomHeader';

import {
  NewControlEntityScreen,
  SetupFormScreen,
  SetupsReplacementScreen,
} from '@containers/builder';

const { Navigator, Screen } = createStackNavigator<BuilderStackParamList>();

export const Builder: FC = () => (
  <Navigator screenOptions={{ header: (props) => <CustomHeader {...props} /> }}>
    <Screen
      name={'NewControlEntity'}
      component={NewControlEntityScreen}
      options={{ headerTitle: 'New Control Entity' }}
    />
    <Screen
      name={'SetupForm'}
      component={SetupFormScreen}
      options={{ headerTitle: 'Setup Form' }}
    />
    <Screen
      name={'SetupsReplacement'}
      component={SetupsReplacementScreen}
      options={{ headerTitle: 'Setups Replacement' }}
    />
  </Navigator>
);
