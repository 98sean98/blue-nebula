import React, { FC } from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Layout } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

export interface PressableBoxProps extends PressableProps {}

export const PressableBox: FC<PressableBoxProps> = ({ children, ...props }) => {
  const pressableStyleFunction = ({
    pressed,
  }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    pressed ? tailwind('opacity-75') : {},
    typeof props.style === 'object' ? props.style : {},
  ];

  return (
    <Pressable {...props} style={pressableStyleFunction}>
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
