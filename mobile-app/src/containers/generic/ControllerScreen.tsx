import React, { FC } from 'react';
import {
  Button,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ControllerScreenProps } from '@navigation/navigationTypes';

import { ControllerOptionType, Diameter, SDR } from '@models';

import { tailwind } from '@styles/tailwind';

import { cancelConnect, connectAsync } from '@reduxApp/bluetooth/actions';
import { RootState } from '@reduxApp/rootReducer';

import { ControllerOption } from '@components/controller';

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

  const dispatch = useDispatch();
  const { isScanningAndConnecting, isBleRpiDeviceConnected } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  const onScanAndConnectPress = () => {
    if (!isScanningAndConnecting) dispatch(connectAsync());
    else dispatch(cancelConnect());
  };

  const readCharacteristic = async () => {
    // try {
    //   const characteristic = await bleRpiDeviceServicesAndCharacteristics?.pipeDiameterCharacteristic.read();
    //   if (characteristic?.value)
    //     console.log(
    //       'pipe diameter value:',
    //       base64.decode(characteristic.value),
    //     );
    // } catch (e) {
    //   console.log('error reading pipe diameter value:', e);
    // }
  };

  const writeCharacteristic = async () => {
    // try {
    //   const value = base64.encode('200');
    //   await bleRpiDeviceServicesAndCharacteristics?.pipeDiameterCharacteristic.writeWithResponse(
    //     value,
    //   );
    // } catch (e) {
    //   console.log('error writing pipe diameter value:', e);
    // }
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
          <Button
            title={
              isScanningAndConnecting
                ? 'Stop scanning and connecting'
                : 'Scan and connect'
            }
            onPress={onScanAndConnectPress}
          />
          {isBleRpiDeviceConnected ? (
            <>
              <Button
                title={'Get pipe diameter'}
                onPress={readCharacteristic}
              />
              <Button
                title={'Send pipe diameter'}
                onPress={writeCharacteristic}
              />
            </>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};
