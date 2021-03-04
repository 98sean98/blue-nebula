import React, { FC } from 'react';
import { View } from 'react-native';
import { Layout, LayoutProps, Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { Page } from '@models/app-maker';

interface PageInfoProps extends LayoutProps {
  pageIndex: number;
  page: Page;
  pageCount: number;
}

export const PageInfo: FC<PageInfoProps> = ({
  pageIndex,
  pageCount,
  ...props
}) => {
  return (
    <Layout {...props} style={[tailwind('p-2'), props?.style ?? {}]}>
      <Text category={'h6'}>Page information</Text>

      <View style={tailwind('mt-1 flex-row flex-wrap justify-between')}>
        <Text>
          {`Focused page index: `}
          <Text category={'s1'}>{pageIndex}</Text>
        </Text>
        <Text>
          {`Total page count: `}
          <Text category={'s1'}>{pageCount}</Text>
        </Text>
      </View>
    </Layout>
  );
};
