import React, { FC } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@ui-kitten/components';

import { ControllerScreenProps } from '@navigation/navigationTypes';

import { SimpleControllerOptionType, Diameter, SDR } from '@models';

import { tailwind } from '@styles/tailwind';

import { cancelConnect, connectAsync } from '@reduxApp/bluetooth/actions';
import { RootState } from '@reduxApp/rootReducer';

import { SimpleControllerOption } from '@components/controller';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';

export const ControllerScreen: FC<ControllerScreenProps> = () => {
  const onOptionPress = (diameter: Diameter, sdr: SDR): void =>
    console.log(`${diameter}_${sdr}`);

  const simpleOptions: Array<SimpleControllerOptionType> = [
    { diameter: Diameter.DN400, sdr: SDR.TypeA, optionText: 'DN400\nSDR17.6' },
    { diameter: Diameter.DN315, sdr: SDR.TypeA, optionText: 'DN315\nSDR17.6' },
    { diameter: Diameter.DN250, sdr: SDR.TypeA, optionText: 'DN250\nSDR17.6' },
    { diameter: Diameter.DN200, sdr: SDR.TypeA, optionText: 'DN200\nSDR17.6' },
  ].map((option) => ({
    ...option,
    id: `${option.diameter}_${option.sdr}`,
    onPress: () => onOptionPress(option.diameter, option.sdr),
  }));

  const renderItem: ListRenderItem<SimpleControllerOptionType> = ({
    item: { optionText, onPress },
  }) => (
    <View style={tailwind('w-1/2 h-40 p-2')}>
      <SimpleControllerOption text={optionText} onPress={onPress} />
    </View>
  );

  const keyExtractor = ({ id }: SimpleControllerOptionType): string => id;

  const dispatch = useDispatch();
  const { isScanningAndConnecting, isBleRpiDeviceConnected } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  const onScanAndConnectPress = () => {
    if (!isScanningAndConnecting) dispatch(connectAsync());
    else dispatch(cancelConnect());
  };

  const { read, write } = useBleRpiDeviceCharacteristic(
    'motorSpeed1',
    'number',
  );

  const readCharacteristic = async () => {
    try {
      const value = await read();
      console.log('read value:', value, 'of type:', typeof value);
    } catch (e) {
      console.log('error reading characteristic value:', e);
    }
  };

  const writeCharacteristic = async () => {
    try {
      await write(350);
      console.log('wrote value:', 350);
    } catch (e) {
      console.log('error writing pipe diameter value:', e);
    }
  };

  return (
    <View style={[{ flex: 1 }]}>
      <FlatList
        style={tailwind('flex-1 px-4')}
        data={simpleOptions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
      />
      {/*<Icon name="facebook" />*/}
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
            <Button style={tailwind('mt-2')} onPress={readCharacteristic}>
              Read value
            </Button>
            <Button style={tailwind('mt-2')} onPress={writeCharacteristic}>
              Write value
            </Button>
          </>
        ) : null}
      </View>
    </View>
  );
};
