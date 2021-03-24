import React, { FC, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, Toggle } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SettingsScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';
import { setSettings } from '@reduxApp/settings/actions';

import {
  RenderBleComponent,
  renderBleErrorAlert,
} from '@components/shared/bluetooth';
import { UserAuth } from '@components/settings';
import { MicroAppDownload } from '@components/micro-app';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';
import { checkIfIpAddress } from '@utilities/functions/checkIfIpAddress';

const styles = StyleSheet.create({
  text: { maxWidth: '75%' },
});

export const SettingsScreen: FC<SettingsScreenProps> = () => {
  const insets = useSafeAreaInsets();

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

  const { read: readIpAddress } = useBleRpiDeviceCharacteristic(
    'ipAddress',
    'string',
  );
  const [ipAddress, setIpAddress] = useState<string>();

  const onIpAddressRead = async () => {
    try {
      const newIpAddress = (await readIpAddress()) as string;
      if (newIpAddress === 'error')
        throw new Error(
          'internal logic error in device while trying to read the ip address',
        );
      else if (!checkIfIpAddress(newIpAddress)) {
        throw new Error(
          `the ip address received is not valid: ${newIpAddress}`,
        );
      }
      setIpAddress(newIpAddress);
    } catch (e) {
      console.log(e);
      renderBleErrorAlert({
        title: 'Read Ip Address Error',
        message: `There was an error trying to read the device's ip address.`,
      });
    }
  };

  return (
    <ScrollView
      style={[{ flex: 1, marginBottom: insets.bottom }, tailwind('my-5 px-4')]}>
      {/* monitor device bluetooth connection */}
      <View style={tailwind('w-full flex-row justify-between items-center')}>
        <Text style={styles.text}>
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

      {/* read ip address */}
      <RenderBleComponent shouldShowHelperText={false}>
        <View
          style={tailwind('mt-4 w-full flex-row justify-between items-center')}>
          <Text style={styles.text}>
            {`Device ip address: `}
            <Text style={tailwind('font-bold')}>{ipAddress ?? ''}</Text>
          </Text>
          <Button appearance={'ghost'} onPress={onIpAddressRead}>
            Read
          </Button>
        </View>
      </RenderBleComponent>

      {/* user authentication */}
      <UserAuth style={tailwind('mt-4')} />

      <MicroAppDownload style={tailwind('mt-4')} />
    </ScrollView>
  );
};
