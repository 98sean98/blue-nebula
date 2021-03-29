import React, { FC } from 'react';
import { View } from 'react-native';
import { Divider, Layout, Text } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MicroAppScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import {
  DataVersionList,
  MicroAppBackup,
  MicroAppDetails,
  MicroAppSelector,
} from '@components/micro-app';

export const MicroAppScreen: FC<MicroAppScreenProps> = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[{ flex: 1, marginBottom: bottom }, tailwind('justify-between')]}>
      <Layout style={tailwind('p-4')} level={'4'}>
        <MicroAppSelector />
        <MicroAppDetails style={tailwind('mt-3')} />
      </Layout>

      <View style={[{ flex: 1 }, tailwind('mt-4')]}>
        <Text category={'h6'} style={tailwind('text-center')}>
          Data Versions
        </Text>
        <DataVersionList
          style={tailwind('mt-2')}
          contentContainerStyle={tailwind('px-2')}
        />
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
