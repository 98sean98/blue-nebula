import React, { FC } from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  View,
  ViewProps,
} from 'react-native';
import { Merge } from 'type-fest';

interface PlatformKeyboardAvoidingViewProps
  extends Merge<KeyboardAvoidingViewProps, ViewProps> {}

export const PlatformKeyboardAvoidingView: FC<PlatformKeyboardAvoidingViewProps> = ({
  children,
  ...props
}) => {
  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView behavior={'padding'} {...props}>
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View {...props}>{children}</View>
  );
};
