import React, { FC, useEffect, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Button, Card, Modal, Text } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { DevControlInterface } from '@models/DevControlInterface';
import { ControlEntityEnum, Enable } from '@models/control-entity';

import { MotorCard } from '@containers/main/DevControllerScreen';

import { RootState } from '@reduxApp';

import { StepperMotorCard } from './StepperMotorCard';
import { renderBleErrorAlert } from '@components/shared/bluetooth';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';
import { mapControlEntityToString } from '@utilities/functions/map';

interface RealTimeControlModeProps {
  isFocused: boolean;
  motors: Array<MotorCard>;
}

export const RealTimeControlMode: FC<RealTimeControlModeProps> = ({
  isFocused,
  motors,
}) => {
  const renderItem: ListRenderItem<typeof motors[0]> = ({
    item: { entity, title, type },
  }) => {
    switch (type) {
      case ControlEntityEnum.StepperMotor:
        return (
          <StepperMotorCard
            entity={entity}
            controlInterface={DevControlInterface.RealTimeControl}
            headerParams={{ title }}
            style={[tailwind('my-2 mx-4')]}
          />
        );
      case ControlEntityEnum.DCMotor:
        return <></>;
    }
  };

  const keyExtractor = (item: MotorCard) => item.entity;

  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);

  const { controlEntities } = useSelector((state: RootState) => state.control);

  const { write: writeStepMotor } = useBleRpiDeviceCharacteristic(
    'stepperMotors',
    'string',
  );

  useEffect(() => {
    if (isFocused) {
      const isEveryEnableLow = Object.values(controlEntities).every(
        (controlEntity) => controlEntity.enable === Enable.Low,
      );
      if (!isEveryEnableLow) setShouldShowModal(true);
    }
  }, [controlEntities, isFocused]);

  const onEnablePinOff = async () => {
    try {
      const strings = [
        mapControlEntityToString({
          ...controlEntities.wheelMotor,
          enable: Enable.Low,
        }),
        mapControlEntityToString({
          ...controlEntities.screwMotor,
          enable: Enable.Low,
        }),
      ];

      for (const string of strings) {
        if (string.length > 0) await writeStepMotor(string);
      }
    } catch (error) {
      console.log(error);
      renderBleErrorAlert({
        title: 'Initialising Real Time Control Error',
        message:
          'There was an error while sending LOW signals to the enable pins.',
      });
    } finally {
      setShouldShowModal(false);
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <FlatList
          data={motors}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>

      <Modal
        visible={shouldShowModal}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <Card disabled style={tailwind('m-4')}>
          <Text category={'s1'}>
            Initialising real time control requires all stepper motor instances
            to have a LOW state in their enable pins.
          </Text>
          <Button
            appearance={'ghost'}
            onPress={onEnablePinOff}
            style={tailwind('mt-4')}>
            Send command to confirm
          </Button>
        </Card>
      </Modal>
    </>
  );
};
