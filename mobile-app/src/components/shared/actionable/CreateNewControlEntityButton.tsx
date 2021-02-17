import React, { FC } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button, ButtonProps } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

import { renderIcon } from '@components/shared/interface/renderIcon';

interface CreateNewControlEntityButtonProps
  extends Omit<ButtonProps, 'children'> {}

export const CreateNewControlEntityButton: FC<CreateNewControlEntityButtonProps> = (
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
      Create Another Entity
    </Button>
  );
};
