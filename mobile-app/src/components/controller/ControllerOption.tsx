import React, { FC } from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  Text,
  TextProps,
  ViewStyle,
} from 'react-native';

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
  const pressableStyleFunction = ({
    pressed,
  }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    tailwind(
      'w-full h-full justify-center items-center bg-gray-300 rounded-xl border-8 border-gray-200',
    ),
    pressed ? tailwind('opacity-75') : {},
    typeof props.style === 'object' ? props.style : {},
  ];

  return (
    <Pressable {...props} style={pressableStyleFunction}>
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
