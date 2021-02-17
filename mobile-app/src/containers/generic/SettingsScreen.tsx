import React, { FC, useEffect } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Text, Toggle } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SettingsScreenProps } from '@navigation/navigationTypes';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';
import { setSettings } from '@reduxApp/settings/actions';

export const SettingsScreen: FC<SettingsScreenProps> = () => {
  const dispatch = useDispatch();

  const settings = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    const writeStorage = async () => {
      const newSettingsJson = JSON.stringify(settings);
      const oldSettingsJson = await AsyncStorage.getItem('settings');
      if (oldSettingsJson !== null)
        await AsyncStorage.mergeItem('settings', newSettingsJson);
      else await AsyncStorage.setItem('settings', newSettingsJson);
    };
    try {
      writeStorage().then();
      console.log('successfully wrote settings data into storage!');
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Write Storage Error',
        'There was an error writing app settings data into your phone storage.',
      );
    }
  }, [settings]);

  const { shouldMonitorDeviceConnection } = settings;

  const { isScanningAndConnecting } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  return (
    <ScrollView style={[{ flex: 1 }, tailwind('py-5 px-4')]}>
      <View style={tailwind('w-full flex-row justify-between items-center')}>
        <Text style={{ maxWidth: '80%' }}>
          Monitor device bluetooth connection when possible
        </Text>
        <Toggle
          disabled={isScanningAndConnecting}
          checked={shouldMonitorDeviceConnection}
          onChange={() =>
            dispatch(
              setSettings({
                shouldMonitorDeviceConnection: !shouldMonitorDeviceConnection,
              }),
            )
          }
        />
      </View>

      {/* todo: build app language selector after implementing i18n */}
    </ScrollView>
  );
};
