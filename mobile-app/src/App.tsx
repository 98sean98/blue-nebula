// react native gesture handler needs to be at the top of everything for react navigation to work correctly
import 'react-native-gesture-handler';

import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

import { store } from '@reduxApp/store';
import { RootNavigator } from '@navigation';

import { BluetoothLayer } from '@components/shared/BluetoothLayer';

enableScreens();

export const App: FC = () => {
  return (
    <Provider store={store}>
      <BluetoothLayer>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </BluetoothLayer>
    </Provider>
  );
};
