import React, { FC } from 'react';
import { View, ViewProps } from 'react-native';
import { tailwind } from '@styles/tailwind';
import { Button, ButtonProps } from '@ui-kitten/components';

interface ConfirmationButtonGroupProps extends ViewProps {
  onNoPress: () => void;
  onYesPress: () => void;
  commonButtonProps?: ButtonProps;
}

export const ConfirmationButtonGroup: FC<ConfirmationButtonGroupProps> = ({
  onNoPress,
  onYesPress,
  commonButtonProps,
  ...props
}) => {
  return (
    <View
      {...props}
      style={[tailwind('flex-row justify-between'), props.style ?? {}]}>
      <Button
        appearance={'ghost'}
        status={'danger'}
        size={'large'}
        onPress={onNoPress}
        {...commonButtonProps}>
        No
      </Button>
      <Button
        appearance={'ghost'}
        status={'success'}
        size={'large'}
        onPress={onYesPress}
        {...commonButtonProps}>
        Yes
      </Button>
    </View>
  );
};
