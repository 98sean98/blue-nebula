import React, { FC } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button, ButtonProps } from '@ui-kitten/components';

import { useControlEntities } from '@utilities/hooks';
import { renderBleErrorAlert } from '@components/shared/bluetooth/renderBleErrorAlert';

interface BleRefreshStateButtonProps extends ButtonProps {}

export const BleRefreshStateButton: FC<BleRefreshStateButtonProps> = ({
  onPress: onHigherOrderPress,
  ...props
}) => {
  const { readAll } = useControlEntities();

  const onPress = async (event: GestureResponderEvent) => {
    try {
      // read all
      await readAll();

      // call higher order press function
      if (typeof onHigherOrderPress !== 'undefined') onHigherOrderPress(event);
    } catch (error) {
      console.log(error);
      renderBleErrorAlert({
        title: 'Refresh Error',
        message: 'There was something wrong with refreshing the state.',
      });
    }
  };

  return (
    <Button {...props} onPress={onPress}>
      Refresh State
    </Button>
  );
};
