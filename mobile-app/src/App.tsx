// react native gesture handler needs to be at the top of everything for react navigation to work correctly
import 'react-native-gesture-handler';

import React, { FC, useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { BleManager, State } from 'react-native-ble-plx';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

import { store } from '@reduxApp/store';
import { BluetoothContext } from '@utilities/context';
import { RootNavigator } from '@navigation';

enableScreens();

export const App: FC = () => {
  const bleManager = useMemo(() => new BleManager(), []);
  const [bleManagerState, setBleManagerState] = useState<State>(State.Unknown);

  useEffect(() => {
    bleManager.onStateChange((newState) => setBleManagerState(newState));
  }, [bleManager]);

  return (
    <Provider store={store}>
      <BluetoothContext.Provider value={{ bleManager, bleManagerState }}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </BluetoothContext.Provider>
    </Provider>
  );
};
