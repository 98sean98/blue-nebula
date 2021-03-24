import React, { FC } from 'react';
import { View } from 'react-native';

import { MicroAppScreenProps } from '@navigation/main';

import { MicroAppBackup } from '@components/micro-app';

export const MicroAppScreen: FC<MicroAppScreenProps> = () => {
  return (
    <View>
      <MicroAppBackup />
    </View>
  );
};
