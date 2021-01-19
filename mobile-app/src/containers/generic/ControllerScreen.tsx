import React, { FC } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
  Button,
} from 'react-native';

import { ControllerScreenProps } from '@navigation/navigationTypes';

import { Diameter, ControllerOptionType, SDR } from '@models';

import { ControllerOption } from '@src/components/controller';
import { tailwind } from '@styles/tailwind';

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

  const onReconnectPress = () => console.log('reconnect clicked!');

  return (
    <View style={[StyleSheet.absoluteFillObject, tailwind('p-4')]}>
      <FlatList
        style={tailwind('flex-1')}
        data={options}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
      />
      <View style={tailwind('py-4')}>
        <Button
          title={'Reconnect to Raspberry Pi'}
          onPress={onReconnectPress}
        />
      </View>
    </View>
  );
};
