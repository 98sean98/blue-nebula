import React, { ComponentProps, FC } from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { ThemedSlider } from './ThemedSlider';

interface SliderInputProps extends ViewProps {
  title: string;
  sliderProps?: ComponentProps<typeof ThemedSlider>;
}

export const SliderInput: FC<SliderInputProps> = ({
  title,
  sliderProps,
  ...props
}) => {
  return (
    <View
      {...props}
      style={[
        tailwind('w-full flex-row justify-between items-center'),
        props?.style ?? {},
      ]}>
      <Text style={tailwind('w-1/3')}>{title}</Text>
      <View style={tailwind('w-2/3 flex-row justify-between items-center')}>
        <ThemedSlider style={tailwind('w-5/6 h-8')} {...sliderProps} />
        <Text style={tailwind('w-1/6 text-right')} category={'s1'}>
          {sliderProps?.value ?? ''}
        </Text>
      </View>
    </View>
  );
};
