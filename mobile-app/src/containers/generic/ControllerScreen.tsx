import React, { FC } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';

import { ControllerScreenProps } from '@navigation/navigationTypes';

import { ControllerOptionType } from '@models';

import { ControllerOption } from '@src/components/controller';
import { tailwind } from '@styles/tailwind';

export const ControllerScreen: FC<ControllerScreenProps> = () => {
  const onOptionPress = (id: string): void => console.log(id);

  const options: Array<ControllerOptionType> = [
    { id: 'dn200', optionText: 'DN200' },
    { id: 'dn250', optionText: 'DN250' },
    { id: 'dn315', optionText: 'DN315' },
    { id: 'dn400', optionText: 'DN400' },
  ].map((option) => ({ ...option, onPress: () => onOptionPress(option.id) }));

  const renderItem: ListRenderItem<ControllerOptionType> = ({
    item: { optionText, onPress },
  }) => (
    <View style={tailwind('w-1/2 h-40 p-2')}>
      <ControllerOption text={optionText} onPress={onPress} />
    </View>
  );

  const keyExtractor = (item: ControllerOptionType): string => item.id;

  return (
    <View style={[StyleSheet.absoluteFillObject, tailwind('p-4')]}>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
      />
    </View>
  );
};
