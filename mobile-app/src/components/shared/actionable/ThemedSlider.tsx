import React, { forwardRef } from 'react';
import { useTheme } from '@ui-kitten/components';
import Slider, { SliderProps, SliderRef } from '@react-native-community/slider';

export const ThemedSlider = forwardRef<SliderRef, SliderProps>((props, ref) => {
  const theme = useTheme();

  return (
    <Slider
      // @ts-ignore
      ref={ref}
      thumbTintColor={theme['color-primary-default']}
      minimumTrackTintColor={theme['color-primary-700']}
      maximumTrackTintColor={theme['background-basic-4']}
      {...props}
    />
  );
});
