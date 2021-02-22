import React, { FC } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button, ButtonProps } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/core';

import { SetupsMode } from '@navigation/builder';

interface NavigateToSetupsButtonProps extends ButtonProps {
  mode?: SetupsMode;
}

export const NavigateToSetupsButton: FC<NavigateToSetupsButtonProps> = ({
  mode,
  ...props
}) => {
  const { navigate } = useNavigation();

  const onPress = (e: GestureResponderEvent) => {
    navigate('Builder', {
      screen: 'Setups',
      params: { mode: mode ?? SetupsMode.Normal },
    });
    if (typeof props.onPress !== 'undefined') props.onPress(e);
  };

  return <Button {...props} onPress={onPress} />;
};
