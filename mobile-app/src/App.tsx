// react native gesture handler needs to be at the top of everything for react navigation to work correctly
import 'react-native-gesture-handler';

import React, { FC, useMemo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { useColorScheme } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { store } from '@reduxApp/store';
import { RootNavigator } from '@navigation';

import {
  BleLayer,
  AsyncStorageLayer,
  SettingsLayer,
  TimerLayer,
  AppMakerLayer,
  PermissionsLayer,
} from '@components/layer';

import { darkTheme, lightTheme } from '@styles/theme/reactNavigationTheme';

enableScreens();

export const App: FC = () => {
  const deviceTheme = useColorScheme();

  const themes = useMemo(
    () =>
      deviceTheme === 'dark'
        ? { navigation: darkTheme, eva: eva.dark }
        : { navigation: lightTheme, eva: eva.light },
    [deviceTheme],
  );

  return (
    <ReduxProvider store={store}>
      <PermissionsLayer>
        <BleLayer>
          <SettingsLayer>
            <AsyncStorageLayer>
              <TimerLayer>
                <AppMakerLayer>
                  <IconRegistry icons={EvaIconsPack} />
                  <ApplicationProvider {...eva} theme={themes.eva}>
                    <NavigationContainer theme={themes.navigation}>
                      <RootNavigator />
                    </NavigationContainer>
                  </ApplicationProvider>
                </AppMakerLayer>
              </TimerLayer>
            </AsyncStorageLayer>
          </SettingsLayer>
        </BleLayer>
      </PermissionsLayer>
    </ReduxProvider>
  );
};
