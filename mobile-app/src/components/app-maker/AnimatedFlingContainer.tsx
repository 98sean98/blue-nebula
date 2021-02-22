import React, { FC, ReactNode, useRef, useState } from 'react';
import { Animated, View, ViewProps } from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  FlingGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import { tailwind } from '@styles/tailwind';

import { ConfigurationViewHeight } from '@containers/main/AppMaker';

interface AnimatedFlingContainerProps extends ViewProps {
  configurationViewHeight: ConfigurationViewHeight;
  children?: ReactNode;
}

export const AnimatedFlingContainer: FC<AnimatedFlingContainerProps> = ({
  configurationViewHeight: { collapsed, expanded, fling },
  children,
  ...props
}) => {
  const slideAnimation = useRef(new Animated.Value(collapsed)).current;

  const slideIn = () => {
    Animated.timing(slideAnimation, {
      toValue: expanded,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnimation, {
      toValue: collapsed,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const [isConfigurationExpanded, setIsConfigurationExpanded] = useState<
    boolean
  >(false);

  const onHandlerStateChange = ({
    nativeEvent,
  }: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state === State.ACTIVE) {
      isConfigurationExpanded ? slideOut() : slideIn();
      setIsConfigurationExpanded(!isConfigurationExpanded);
    }
  };

  return (
    <Animated.View style={[{ height: slideAnimation }, props?.style ?? {}]}>
      <FlingGestureHandler
        direction={isConfigurationExpanded ? Directions.DOWN : Directions.UP}
        onHandlerStateChange={onHandlerStateChange}>
        <View style={[tailwind('w-full bg-blue-300'), { height: fling }]} />
      </FlingGestureHandler>
      {/* content */}
      {typeof children !== 'undefined' ? (
        <View style={{ flex: 1 }}>{children}</View>
      ) : null}
    </Animated.View>
  );
};
