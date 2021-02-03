import React, { FC, useState } from 'react';
import { Alert, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Input, Text } from '@ui-kitten/components';

import { DevControllerScreenProps } from '@navigation/navigationTypes';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp/rootReducer';

import { BleRunIdleButton } from '@components/shared/bluetooth';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';

export const DevControllerScreen: FC<DevControllerScreenProps> = () => {
  const { isBleRpiDeviceConnected } = useSelector(
    (state: RootState) => state.bluetooth,
  );

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

  return (
    <View style={[{ flex: 1 }]}>
      <View style={tailwind('p-4')}>
        {isBleRpiDeviceConnected ? (
          <>
            <Input
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
