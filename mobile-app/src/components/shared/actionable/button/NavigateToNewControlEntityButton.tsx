import React, { FC } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button, ButtonProps } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { renderIcon } from '@components/shared/interface/renderIcon';

interface NavigateToNewControlEntityButtonProps
  extends Omit<ButtonProps, 'children'> {}

export const NavigateToNewControlEntityButton: FC<NavigateToNewControlEntityButtonProps> = (
  props,
) => {
  const { navigate } = useNavigation();

  const onPress = (e: GestureResponderEvent) => {
    navigate('Builder', {
      screen: 'NewControlEntity',
    });
    if (typeof props.onPress !== 'undefined') props.onPress(e);
  };

  return (
    <Button accessoryLeft={renderIcon('plus')} {...props} onPress={onPress}>
      Create Entity
    </Button>
  );
};
