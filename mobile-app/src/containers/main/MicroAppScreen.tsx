import React, { FC } from 'react';
import { View } from 'react-native';
import { Divider, Layout, Text } from '@ui-kitten/components';

import { MicroAppScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import {
  MicroAppBackup,
  MicroAppInfo,
  MicroAppSelector,
} from '@components/micro-app';
import { DataVersionList } from '@components/micro-app/DataVersionList';

export const MicroAppScreen: FC<MicroAppScreenProps> = () => {
  return (
    <View style={[{ flex: 1 }, tailwind('mb-5 justify-between')]}>
      <Layout style={tailwind('p-4')} level={'4'}>
        <MicroAppSelector />
        <MicroAppInfo style={tailwind('mt-3')} />
      </Layout>

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
