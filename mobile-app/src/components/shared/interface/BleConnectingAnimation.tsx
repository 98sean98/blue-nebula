import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, View, ViewProps } from 'react-native';
import { useTheme } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { robot, smartphone } from '@assets/images';

interface BleConnectingAnimationProps extends ViewProps {}

const slideWidth = 100,
  sliderWidth = slideWidth / 4;

export const BleConnectingAnimation: FC<BleConnectingAnimationProps> = ({
  ...props
}) => {
  const theme = useTheme();

  const slideAnimation = useRef(new Animated.Value(0)).current;

  const [beginSlidingRight, setBeginSlidingRight] = useState<boolean>(true);

  const slideRight = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: slideWidth - sliderWidth,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setBeginSlidingRight(false));
  }, [slideAnimation]);

  const slideLeft = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setBeginSlidingRight(true));
  }, [slideAnimation]);

  useEffect(() => {
    if (beginSlidingRight) slideRight();
    else slideLeft();
  }, [beginSlidingRight, slideRight, slideLeft]);

  return (
    <View
      style={[
        tailwind('flex flex-row justify-between items-center'),
        props?.style ?? {},
      ]}>
      <Image source={smartphone} style={tailwind('w-16 h-16 mr-4')} />
      <View style={{ width: slideWidth }}>
        <Animated.View
          style={[
            {
              transform: [{ translateX: slideAnimation }],
              width: slideWidth / 5,
              backgroundColor: theme['color-primary-500'],
            },
            tailwind('h-2 rounded-full'),
          ]}
        />
      </View>
      <Image source={robot} style={tailwind('w-16 h-16 ml-4 rounded-xl')} />
    </View>
  );
};
