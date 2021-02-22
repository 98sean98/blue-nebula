import React, { FC, ReactNode, useCallback, useEffect, useRef } from 'react';
import { Animated, View, ViewProps } from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  FlingGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import { Layout } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { ConfigurationViewHeight } from '@containers/main/AppMaker';

import { useAppMakerContext } from '@utilities/hooks';

interface AnimatedFlingContainerProps extends ViewProps {
  configurationViewHeight: ConfigurationViewHeight;
  children?: ReactNode;
}

export const AnimatedFlingContainer: FC<AnimatedFlingContainerProps> = ({
  configurationViewHeight: { collapsed, expanded, fling },
  children,
  ...props
}) => {
  const {
    shouldExpandConfigView,
    setShouldExpandConfigView,
  } = useAppMakerContext();

  const slideAnimation = useRef(new Animated.Value(collapsed)).current;

  const slideUp = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: expanded,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [slideAnimation, expanded]);

  const slideDown = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: collapsed,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [slideAnimation, collapsed]);

  const onHandlerStateChange = ({
    nativeEvent,
  }: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state === State.ACTIVE)
      setShouldExpandConfigView(!shouldExpandConfigView);
  };

  useEffect(() => {
    shouldExpandConfigView ? slideUp() : slideDown();
  }, [shouldExpandConfigView, slideUp, slideDown]);

  return (
    <Animated.View style={[{ height: slideAnimation }, props?.style ?? {}]}>
      <Layout level={'4'} style={[{ flex: 1 }, tailwind('rounded-t-lg')]}>
        <FlingGestureHandler
          direction={shouldExpandConfigView ? Directions.DOWN : Directions.UP}
          onHandlerStateChange={onHandlerStateChange}>
          <View
            style={[
              tailwind('w-full justify-center items-center'),
              { height: fling },
            ]}>
            <Layout style={tailwind('w-2/3 h-1/4 rounded-full')} level={'2'} />
          </View>
        </FlingGestureHandler>

        {/* content */}
        {typeof children !== 'undefined' ? (
          <View style={{ flex: 1 }}>{children}</View>
        ) : null}
      </Layout>
    </Animated.View>
  );
};
