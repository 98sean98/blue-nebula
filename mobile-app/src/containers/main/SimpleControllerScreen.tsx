import React, { FC } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';

import { tailwind } from '@styles/tailwind';

import { SimpleControllerScreenProps } from '@navigation/main';

import {
  Diameter,
  SDR,
  SimpleControllerOptionType,
} from '@models/SimpleController';

import { SimpleControllerOption } from '@components/controller/simple';
import {
  BleRunIdleButton,
  RenderBleComponent,
} from '@components/shared/bluetooth';

export const SimpleControllerScreen: FC<SimpleControllerScreenProps> = () => {
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

  return (
    <RenderBleComponent>
      <View style={{ flex: 1 }}>
        <FlatList
          style={tailwind('flex-1 px-4')}
          data={simpleOptions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
        />
        <BleRunIdleButton style={tailwind('m-4')} />
      </View>
    </RenderBleComponent>
  );
};
