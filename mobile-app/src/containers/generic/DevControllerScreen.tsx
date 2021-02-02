import React, { FC, useState } from 'react';
import { Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from '@ui-kitten/components';

import { DevControllerScreenProps } from '@navigation/navigationTypes';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp/rootReducer';
import { cancelConnect, connectAsync } from '@reduxApp/bluetooth/actions';

import { BleRunIdleButton } from '@components/shared/bluetooth';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';

export const DevControllerScreen: FC<DevControllerScreenProps> = () => {
  const dispatch = useDispatch();
  const { isScanningAndConnecting, isBleRpiDeviceConnected } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  const onScanAndConnectPress = () => {
    if (!isScanningAndConnecting) dispatch(connectAsync());
    else dispatch(cancelConnect());
  };

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
        {!isBleRpiDeviceConnected ? (
          <Button onPress={onScanAndConnectPress}>
            {isScanningAndConnecting
              ? 'Stop scanning and connecting'
              : 'Scan and connect'}
          </Button>
        ) : null}
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
        ) : null}
      </View>
    </View>
  );
};
