import React, { ComponentProps, FC } from 'react';
import { View, ViewProps } from 'react-native';
import { Text, TextProps } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { ControlEntityParameterToggle } from './ControlEntityParameterToggle';

interface ControlEntityParameterToggleWithLabelProps extends ViewProps {
  toggleProps: ComponentProps<typeof ControlEntityParameterToggle>;
  textProps?: TextProps;
  labelText: string;
}

export const ControlEntityParameterToggleWithLabel: FC<ControlEntityParameterToggleWithLabelProps> = ({
  toggleProps,
  textProps,
  labelText,
  ...props
}) => {
  return (
    <View {...props} style={[tailwind('items-center'), props?.style ?? {}]}>
      <ControlEntityParameterToggle {...toggleProps} />
      <Text
        category={'label'}
        appearance={'hint'}
        {...textProps}
        style={[tailwind('mt-1'), textProps?.style ?? {}]}>
        {labelText}
      </Text>
    </View>
  );
};
