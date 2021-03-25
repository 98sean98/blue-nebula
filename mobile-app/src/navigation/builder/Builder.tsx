import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { BuilderStackParamList } from './navigationTypes';

import { CustomHeader } from './CustomHeader';

import {
  NewControlEntityScreen,
  SetupFormScreen,
  SetupsReplacementScreen,
} from '@containers/builder';

const { Navigator, Screen } = createStackNavigator<BuilderStackParamList>();

export const Builder: FC = () => {
  const { t } = useTranslation();

  return (
    <Navigator
      screenOptions={{ header: (props) => <CustomHeader {...props} /> }}>
      <Screen
        name={'NewControlEntity'}
        component={NewControlEntityScreen}
        options={{
          headerTitle: t('navigation.builder.NewControlEntity') as string,
        }}
      />
      <Screen
        name={'SetupForm'}
        component={SetupFormScreen}
        options={{ headerTitle: t('navigation.builder.SetupForm') as string }}
      />
      <Screen
        name={'SetupsReplacement'}
        component={SetupsReplacementScreen}
        options={{
          headerTitle: t('navigation.builder.SetupsReplacement') as string,
        }}
      />
    </Navigator>
  );
};
