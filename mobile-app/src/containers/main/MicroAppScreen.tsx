import React, { FC } from 'react';
import { View } from 'react-native';
import { Divider, Layout } from '@ui-kitten/components';

import { MicroAppScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { MicroAppBackup } from '@components/micro-app';
import { DataVersionList } from '@components/micro-app/DataVersionList';

export const MicroAppScreen: FC<MicroAppScreenProps> = () => {
  return (
    <View style={[{ flex: 1 }, tailwind('my-5')]}>
      <DataVersionList />

      <Divider />

      <Layout style={tailwind('w-full py-1 px-4')} level={'2'}>
        <MicroAppBackup />
      </Layout>
    </View>
  );
};
