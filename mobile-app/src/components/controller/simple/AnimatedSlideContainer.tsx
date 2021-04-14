import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

interface AnimatedSlideContainerProps extends ViewProps {
  horizontalTranslation: {
    from: number;
    to: number;
  };
  shouldSlideIn: boolean;
}

export const AnimatedSlideContainer: FC<AnimatedSlideContainerProps> = ({
  horizontalTranslation: { from, to },
  shouldSlideIn,
  children,
  ...props
}) => {
  const slideAnimation = useRef(new Animated.Value(from)).current;

  const slideIn = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: to,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [slideAnimation, to]);

  const slideOut = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: from,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [slideAnimation, from]);

  useEffect(() => {
    shouldSlideIn ? slideIn() : slideOut();
  }, [shouldSlideIn, slideIn, slideOut]);

  return (
    <Animated.View
      style={[
        { transform: [{ translateX: slideAnimation }] },
        props?.style ?? {},
      ]}>
      {children}
    </Animated.View>
  );
};
