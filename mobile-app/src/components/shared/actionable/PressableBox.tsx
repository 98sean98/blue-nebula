import React, { FC } from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Text, TextProps, Layout } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

interface PressableBoxProps extends PressableProps {
  text: string;
  textProps?: TextProps;
}

export const PressableBox: FC<PressableBoxProps> = ({
  text,
  textProps,
  ...props
}) => {
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
          style={tailwind('flex-1 rounded justify-center items-center')}
          level={'2'}>
          <Text
            {...textProps}
            style={[
              tailwind('font-bold text-2xl text-center'),
              textProps?.style || {},
            ]}>
            {text}
          </Text>
        </Layout>
      </Layout>
    </Pressable>
  );
};
