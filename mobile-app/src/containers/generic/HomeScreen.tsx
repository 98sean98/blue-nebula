import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { HomeScreenProps } from '@navigation/navigationTypes';

import { Hello, World } from '@components/shared';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const HomeScreen: FC<HomeScreenProps> = () => {
  return (
    <View style={styles.body}>
      <Hello />
      <World />
    </View>
  );
};
