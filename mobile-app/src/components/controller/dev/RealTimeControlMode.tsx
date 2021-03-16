import React, { FC, useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { Button, Card, Modal, Text } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { DevControlInterface } from '@models/ui';
import {
  BLDCMotor,
  ControlEntityEnum,
  Enable,
  StepperMotor,
} from '@models/control-entity';

import { RootState } from '@reduxApp';

import { StepperMotorCard } from './stepper-motor';
import { BLDCMotorCard } from './bldc-motor';
import { renderBleErrorAlert } from '@components/shared/bluetooth';
import { PlatformKeyboardAvoidingView } from '@components/shared/interface';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';
import { mapControlEntityToString } from '@utilities/functions/map';
import { checkIfObjectValuesAreDefined } from '@utilities/functions/checkIfObjectValuesAreDefined';

interface RealTimeControlModeProps {
  isFocused: boolean;
}

export const RealTimeControlMode: FC<RealTimeControlModeProps> = ({
  isFocused,
}) => {
  const { controlEntities } = useSelector((state: RootState) => state.control);

  const data = useMemo(
    () =>
      Object.entries(controlEntities).map(([entity, controlEntity]) => ({
        entity,
        controlEntity,
      })),
    [controlEntities],
  );

  const renderItem: ListRenderItem<typeof data[0]> = ({
    item: { entity, controlEntity },
  }) => {
    switch (controlEntity.type) {
      case ControlEntityEnum.StepperMotor:
        return (
          <StepperMotorCard
            entity={entity}
            controlEntity={controlEntity as StepperMotor}
            controlInterface={DevControlInterface.RealTimeControl}
            style={[tailwind('my-2 mx-4')]}
          />
        );
      case ControlEntityEnum.DCMotor:
        return <></>;
      case ControlEntityEnum.BLDCMotor:
        return (
          <BLDCMotorCard
            entity={entity}
            controlEntity={controlEntity as BLDCMotor}
            controlInterface={DevControlInterface.RealTimeControl}
            style={tailwind('my-2 mx-4')}
          />
        );
    }
  };

  const keyExtractor = (item: typeof data[0]) => item.entity;

  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);

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
      const strings = Object.values(controlEntities).map((controlEntity) =>
        controlEntity.type === ControlEntityEnum.StepperMotor &&
        checkIfObjectValuesAreDefined(controlEntity)
          ? mapControlEntityToString(controlEntity)
          : '',
      );

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
      <PlatformKeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={150}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </PlatformKeyboardAvoidingView>

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
