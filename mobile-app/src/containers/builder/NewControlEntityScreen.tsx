import React, { FC } from 'react';
import { View } from 'react-native';
import { Text } from '@ui-kitten/components';

import { NewControlEntityScreenProps } from '@navigation/builder';

export const NewControlEntityScreen: FC<NewControlEntityScreenProps> = () => {
  return (
    <View>
      <Text>New control entity screen</Text>
    </View>
  );
};
