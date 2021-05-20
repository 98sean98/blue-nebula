import React, { FC } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Button, ButtonProps } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

import { setApplicationAlert } from '@reduxApp/application/actions';

import { useControlEntities } from '@utilities/hooks';

interface BleReadDeviceButtonProps extends ButtonProps {}

export const BleReadDeviceButton: FC<BleReadDeviceButtonProps> = ({
  onPress: onHigherOrderPress,
  ...props
}) => {
  const dispatch = useDispatch();

  const { readAll } = useControlEntities();

  const onPress = async (event: GestureResponderEvent) => {
    try {
      // read all
      await readAll();

      // call higher order press function
      if (typeof onHigherOrderPress !== 'undefined') onHigherOrderPress(event);
    } catch (error) {
      console.log(error);
      dispatch(
        setApplicationAlert({
          title: 'Read Device Error',
          message:
            'There was something wrong with reading the state of the device.',
        }),
      );
    }
  };

  return (
    <Button {...props} onPress={onPress}>
      Read Device
    </Button>
  );
};
