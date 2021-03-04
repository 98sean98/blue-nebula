import React, { FC } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Layout } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { getPressableStyle } from '@utilities/functions/ui';

export interface PressableBoxProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
}

export const PressableBox: FC<PressableBoxProps> = ({ children, ...props }) => {
  return (
    <Pressable
      {...props}
      style={(state) =>
        getPressableStyle(state, {
          pressed: tailwind('opacity-75'),
          additional: props?.style,
        })
      }>
      <Layout style={tailwind('flex-1 rounded-lg p-2')} level={'4'}>
        <Layout
          style={tailwind('flex-1 rounded justify-center items-center p-2')}
          level={'2'}>
          {children}
        </Layout>
      </Layout>
    </Pressable>
  );
};
