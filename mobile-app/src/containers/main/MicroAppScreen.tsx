import React, { FC } from 'react';
import { View } from 'react-native';
import { Divider, Layout, Text } from '@ui-kitten/components';

import { MicroAppScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { MicroAppBackup, MicroAppSelector } from '@components/micro-app';
import { DataVersionList } from '@components/micro-app/DataVersionList';

export const MicroAppScreen: FC<MicroAppScreenProps> = () => {
  return (
    <View style={[{ flex: 1 }, tailwind('my-5 justify-between')]}>
      <MicroAppSelector style={tailwind('mx-4')} />

      <View style={[{ flex: 1 }, tailwind('mt-4')]}>
        <Text category={'h6'} style={tailwind('text-center')}>
          Data Versions
        </Text>
        <DataVersionList style={tailwind('mt-2')} />
      </View>

      <View>
        <Divider />
        <Layout style={tailwind('w-full py-1 px-4')} level={'2'}>
          <MicroAppBackup />
        </Layout>
      </View>
    </View>
  );
};
