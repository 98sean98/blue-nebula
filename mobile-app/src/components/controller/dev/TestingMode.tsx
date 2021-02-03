import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Text } from '@ui-kitten/components';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';

interface TestingModeProps {}

export const TestingMode: FC<TestingModeProps> = () => {
  const dispatch = useDispatch();

  const { controlEntities } = useSelector((state: RootState) => state.control);

  return (
    <View>
      <Button
        onPress={() =>
          dispatch(setControlEntities({ wheelMotor: { speed: 100 } }))
        }>
        press me
      </Button>

      <Text>{`${controlEntities.wheelMotor.speed}`}</Text>
    </View>
  );
};
