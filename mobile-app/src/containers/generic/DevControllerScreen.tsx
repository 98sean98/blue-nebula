import React, { FC, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Tab, TabView, Text } from '@ui-kitten/components';

import { DevControllerScreenProps } from '@navigation/navigationTypes';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp/rootReducer';
import {
  startMonitoringConnectionAsync,
  stopMonitoringConnection,
} from '@reduxApp/bluetooth/actions';

import { TestingMode, RealTimeControlMode } from '@components/controller/dev';
import { BleRunIdleButton } from '@components/shared/bluetooth';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';

export const DevControllerScreen: FC<DevControllerScreenProps> = () => {
  const dispatch = useDispatch();
  const {
    isBleRpiDeviceConnected,
    isMonitoringBleRpiDeviceConnection,
  } = useSelector((state: RootState) => state.bluetooth);

  const [writeValue, setWriteValue] = useState<string>(
    'motor_1, 10, 2203.24, 1, 0',
  );

  const { read, write } = useBleRpiDeviceCharacteristic('stepMotors', 'string');

  const readCharacteristic = async () => {
    try {
      const value = await read();
      console.log('read value:', value, 'of type:', typeof value);
      Alert.alert('Read value', value as string);
    } catch (e) {
      console.log('error reading characteristic value:', e);
      Alert.alert(e);
    }
  };

  const writeCharacteristic = async () => {
    try {
      if (typeof writeValue !== 'undefined') {
        await write(writeValue);
        console.log('wrote value:', writeValue);
        Alert.alert('Wrote value', writeValue);
        // setWriteValue('');
      } else throw new Error('write value is undefined');
    } catch (e) {
      console.log('error writing characteristic value:', e);
      Alert.alert(e);
    }
  };

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <View style={[{ flex: 1 }]}>
      <TabView
        style={[{ flex: 1 }, tailwind('pt-2')]}
        tabBarStyle={tailwind('p-2')}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}>
        <Tab title={'Testing'}>
          <ScrollView style={tailwind('p-4')}>
            <TestingMode />
          </ScrollView>
        </Tab>
        <Tab title={'Real Time Control'}>
          <ScrollView style={tailwind('p-4')}>
            <RealTimeControlMode />
          </ScrollView>
        </Tab>
      </TabView>

      <View style={tailwind('p-4')}>
        {isBleRpiDeviceConnected ? (
          <>
            <Button
              style={tailwind('mt-2')}
              status={isMonitoringBleRpiDeviceConnection ? 'danger' : 'success'}
              onPress={() => {
                isMonitoringBleRpiDeviceConnection
                  ? dispatch(stopMonitoringConnection())
                  : dispatch(startMonitoringConnectionAsync());
              }}>
              {`${
                isMonitoringBleRpiDeviceConnection ? 'stop' : 'start'
              } monitoring connection`}
            </Button>
            <Input
              style={tailwind('mt-8')}
              placeholder={'Write a value to send to ble rpi device'}
              value={writeValue}
              onChangeText={(newValue) => setWriteValue(newValue)}
            />
            <Button style={tailwind('mt-2')} onPress={readCharacteristic}>
              Read value
            </Button>
            <Button style={tailwind('mt-2')} onPress={writeCharacteristic}>
              Write value
            </Button>
            <BleRunIdleButton style={tailwind('mt-2')} />
          </>
        ) : (
          <Text>
            Bluetooth is not connected, please press the bluetooth icon in the
            navigation bar.
          </Text>
        )}
      </View>
    </View>
  );
};
