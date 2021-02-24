import React, { FC } from 'react';
import { View } from 'react-native';
import { Layout, LayoutProps, Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { Page } from '@models/app-maker';

interface PageInfoProps extends LayoutProps {
  pageIndex: number;
  page: Page;
}

export const PageInfo: FC<PageInfoProps> = ({ pageIndex, page, ...props }) => {
  console.log(page);

  return (
    <Layout {...props} style={[tailwind('p-2'), props?.style ?? {}]}>
      <Text category={'h6'}>Page information</Text>

      <View style={tailwind('mt-1 flex-row')}>
        <Text category={'s1'}>Index:</Text>
        <Text style={tailwind('ml-1')}>{pageIndex}</Text>
      </View>
    </Layout>
  );
};
