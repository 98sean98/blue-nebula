import React, { FC } from 'react';
import { Pressable, PressableProps, Text, TextProps } from 'react-native';

import { tailwind } from '@styles/tailwind';

interface ControllerOptionProps extends PressableProps {
  text: string;
  textProps?: TextProps;
}

export const ControllerOption: FC<ControllerOptionProps> = ({
  text,
  textProps,
  ...props
}) => {
  return (
    <Pressable
      {...props}
      style={[
        tailwind(
          'w-full h-full justify-center items-center bg-gray-300 rounded-xl border-8 border-gray-200',
        ),
      ]}>
      <Text
        {...textProps}
        style={[
          tailwind('font-bold text-2xl text-center'),
          textProps?.style || {},
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};
