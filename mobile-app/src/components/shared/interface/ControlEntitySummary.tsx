import React, { FC, memo } from 'react';
import { View } from 'react-native';
import { LayoutProps, Layout, Text } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

interface ControlEntitySummaryProps extends LayoutProps {}

export const ControlEntitySummary: FC<ControlEntitySummaryProps> = memo(
  (props) => {
    const { controlEntities } = useSelector(
      (state: RootState) => state.control,
    );

    return (
      <Layout {...props}>
        {Object.values(controlEntities).map((controlEntity, i) => (
          <Layout
            key={i}
            level={'2'}
            style={[
              i !== 0 ? tailwind('mt-2') : undefined,
              tailwind('p-2 rounded'),
            ]}>
            {typeof controlEntity === 'object'
              ? Object.entries(controlEntity).map(([param, value], j) => (
                  <View
                    key={j}
                    style={tailwind('flex-row flex-wrap justify-between')}>
                    <Text appearance={'hint'}>{`${param}:`}</Text>
                    <Text>{value}</Text>
                  </View>
                ))
              : null}
          </Layout>
        ))}
      </Layout>
    );
  },
);
