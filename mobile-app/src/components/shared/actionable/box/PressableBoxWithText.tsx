import React, { FC } from 'react';
import { Text, TextProps } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { PressableBox, PressableBoxProps } from './PressableBox';

interface PressableBoxWithTextProps extends PressableBoxProps {
  text: string;
  textProps?: TextProps;
}

export const PressableBoxWithText: FC<PressableBoxWithTextProps> = ({
  text,
  textProps,
  ...props
}) => {
  return (
    <PressableBox {...props}>
      <Text
        {...textProps}
        style={[
          tailwind('font-bold text-2xl text-center'),
          textProps?.style || {},
        ]}>
        {text}
      </Text>
    </PressableBox>
  );
};
