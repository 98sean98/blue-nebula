import React, { FC, useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Card, Modal, Text } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { DevControlInterface } from '@models/ui';
import {
  BLDCMotor,
  ControlEntityEnum,
  DCMotor,
  Enable,
  StepperMotor,
} from '@models/control-entity';

import { RootState } from '@reduxApp';

import { StepperMotorCard } from './stepper-motor';
import { DCMotorCard } from './dc-motor';
import { BLDCMotorCard } from './bldc-motor';
import { renderBleErrorAlert } from '@components/shared/bluetooth';
import { PlatformKeyboardAvoidingView } from '@components/shared/interface';

import { useControlEntities } from '@utilities/hooks';

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
        return (
          <DCMotorCard
            entity={entity}
            controlEntity={controlEntity as DCMotor}
            controlInterface={DevControlInterface.RealTimeControl}
            style={[tailwind('my-2 mx-4')]}
          />
        );
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

  const { writeAll, setControlEntityByParameter } = useControlEntities();

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        const isEveryEnableLow = Object.values(controlEntities).every(
          (controlEntity) => controlEntity.enable === Enable.Low,
        );
        if (!isEveryEnableLow) {
          Object.entries(controlEntities).forEach(([entity, { enable }]) => {
            if (enable !== Enable.Low)
              setControlEntityByParameter(
                entity,
                'enable',
                Enable.Low.toString(),
                'number',
              );
          });
          setShouldShowModal(true);
        }
      }
    }, [isFocused, controlEntities, setControlEntityByParameter]),
  );

  const onEnablePinOff = async () => {
    try {
      await writeAll();
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
