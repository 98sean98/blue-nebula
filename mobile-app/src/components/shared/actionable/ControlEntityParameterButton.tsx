import React, { FC } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button, ButtonProps } from '@ui-kitten/components';

interface ControlEntityParameterButtonProps extends ButtonProps {
  isSelected: boolean;
  onSelected: (isSelected: boolean) => void;
}

export const ControlEntityParameterButton: FC<ControlEntityParameterButtonProps> = ({
  isSelected,
  onSelected,
  children,
  onPress: onHigherPress,
  ...props
}) => {
  const onPress = (e: GestureResponderEvent) => {
    onSelected(!isSelected);
    if (typeof onHigherPress !== 'undefined') onHigherPress(e);
  };

  return (
    <Button
      size={'small'}
      status={'info'}
      appearance={isSelected ? 'outline' : 'ghost'}
      {...props}
      onPress={onPress}>
      {children}
    </Button>
  );
};
