import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Device, ScanCallbackType } from 'react-native-ble-plx';

import { ControllerScreenProps } from '@navigation/navigationTypes';

import { ControllerOptionType, Diameter, SDR } from '@models';
import { RpiDevice } from '@config/RpiDevice';

import { tailwind } from '@styles/tailwind';

import { ControllerOption } from '@src/components/controller';
import { useBluetoothContext } from '@utilities/hooks';

const rpiDevice = new RpiDevice();

export const ControllerScreen: FC<ControllerScreenProps> = () => {
  const onOptionPress = (diameter: Diameter, sdr: SDR): void =>
    console.log(`${diameter}_${sdr}`);

  const options: Array<ControllerOptionType> = [
    { diameter: Diameter.DN400, sdr: SDR.TypeA, optionText: 'DN400\nSDR17.6' },
    { diameter: Diameter.DN315, sdr: SDR.TypeA, optionText: 'DN315\nSDR17.6' },
    { diameter: Diameter.DN250, sdr: SDR.TypeA, optionText: 'DN250\nSDR17.6' },
    { diameter: Diameter.DN200, sdr: SDR.TypeA, optionText: 'DN200\nSDR17.6' },
  ].map((option) => ({
    ...option,
    id: `${option.diameter}_${option.sdr}`,
    onPress: () => onOptionPress(option.diameter, option.sdr),
  }));

  const renderItem: ListRenderItem<ControllerOptionType> = ({
    item: { optionText, onPress },
  }) => (
    <View style={tailwind('w-1/2 h-40 p-2')}>
      <ControllerOption text={optionText} onPress={onPress} />
    </View>
  );

  const keyExtractor = ({ id }: ControllerOptionType): string => id;

  const [isScanning, setIsScanning] = useState<boolean>(false);

  const onReconnectPress = () => setIsScanning(true);

  const { bleManager } = useBluetoothContext();
  const [bleRpiDevice, setBleRpiDevice] = useState<Device>();

  useEffect(() => {
    if (isScanning) {
      bleManager.startDeviceScan(
        null,
        {
          allowDuplicates: false,
          callbackType: ScanCallbackType.FirstMatch,
        },
        (error, scannedDevice) => {
          if (error) console.log(error.errorCode);
          if (scannedDevice && scannedDevice.name === rpiDevice.name) {
            console.log('found rpi device!');
            rpiDevice.setDeviceId(scannedDevice.id);
          }
        },
      );
      console.log('scanning devices...');
      const timeout = setTimeout(() => {
        bleManager.stopDeviceScan();
        console.log('stopped device scanning');
        console.log('rpiDevice id:', rpiDevice.deviceId);
        setIsScanning(false);

        if (rpiDevice.deviceId)
          bleManager
            .connectToDevice(rpiDevice.deviceId, {
              autoConnect: true,
            })
            .then((connectedDevice) => {
              console.log('successfully connected to device');
              setBleRpiDevice(connectedDevice);
            })
            .catch((error) =>
              console.log('error connecting to device:', error),
            );
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [bleManager, isScanning]);

  const onServicesListPress = async () => {
    console.log('getting services');
    const device = await bleRpiDevice?.discoverAllServicesAndCharacteristics();
    const services = await device?.services();
    console.log(services);
    services?.map(async (service) => {
      console.log('service:', service.id, service.uuid);
      const characteristics = await service.characteristics();
      characteristics?.map((characteristic) =>
        console.log('\tcharacteristic:', characteristic.uuid),
      );
    });
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFillObject]}>
      <View style={[StyleSheet.absoluteFillObject, tailwind('p-4')]}>
        <FlatList
          style={tailwind('flex-1')}
          data={options}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
        />
        <View style={tailwind('pt-4')}>
          <Button title={'Reconnect to Robot'} onPress={onReconnectPress} />
          {bleRpiDevice ? (
            <Button
              title={'List services and characteristics'}
              onPress={onServicesListPress}
            />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};
