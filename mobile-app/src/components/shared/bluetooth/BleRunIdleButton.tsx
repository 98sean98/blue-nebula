import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { Button, ButtonProps, Card, Modal, Text } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';

import { tailwind } from '@styles/tailwind';

import {
  useBleRpiDeviceCharacteristic,
  useControlEntities,
} from '@utilities/hooks';

import { renderBleErrorAlert } from '@components/shared/bluetooth/renderBleErrorAlert';
import { ControlEntitySummary } from '@components/shared/interface';

interface BleRunIdleButtonProps extends Omit<ButtonProps, 'onPress'> {
  showVerbose?: boolean;
  onStateChange?: (isRunning: boolean) => void;
}

export const BleRunIdleButton: FC<BleRunIdleButtonProps> = ({
  showVerbose,
  onStateChange,
  ...props
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);

  const { read, write } = useBleRpiDeviceCharacteristic('runIdle', 'boolean');

  const { writeAll } = useControlEntities();

  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    if (isFocused)
      read()
        .then((value) => setIsRunning(value as boolean))
        .catch((error) => console.log(error));
  }, [read, shouldShowModal, isFocused]);

  // call parent on state change function as a side effect
  useEffect(() => {
    if (typeof onStateChange !== 'undefined') onStateChange(isRunning);
  }, [isRunning, onStateChange]);

  const onButtonPress = async () => {
    try {
      const nextRunningState = !isRunning;
      // write all control entities to device, and pop the confirmation modal if it is supposed to run
      if (nextRunningState) {
        await writeAll();
        setShouldShowModal(true);
      }
      // write false to stop the device
      else {
        await write(false);
        setIsRunning(false);
      }
    } catch (error) {
      console.log(error);
      renderBleErrorAlert({
        title: 'Start / Stop Error',
        message:
          'There was something wrong with starting / stopping the device.',
      });
    }
  };

  const onConfirmStartPress = useCallback(async () => {
    try {
      await write(true);
    } catch (error) {
      console.log(error);
      renderBleErrorAlert({
        title: 'Confirm Start Error',
        message:
          'There was something wrong with confirming to start the device.',
      });
    } finally {
      setShouldShowModal(false);
    }
  }, [write]);

  return (
    <>
      <Button
        {...props}
        status={isRunning ? 'danger' : 'primary'}
        onPress={onButtonPress}>
        {isRunning ? 'Stop' : 'Start'}
      </Button>

      <Modal
        visible={shouldShowModal}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setShouldShowModal(false)}>
        <Card disabled style={tailwind('m-4')}>
          <Text category={'h5'}>Are you ready to start?</Text>
          {showVerbose ? (
            <ScrollView
              style={{ maxHeight: Dimensions.get('window').height * 0.6 }}>
              <ControlEntitySummary style={tailwind('mt-1')} />
            </ScrollView>
          ) : null}
          <View style={tailwind('mt-3 flex-row justify-between')}>
            <Button
              appearance={'ghost'}
              status={'warning'}
              size={'large'}
              onPress={() => setShouldShowModal(false)}>
              No
            </Button>
            <Button
              appearance={'ghost'}
              status={'success'}
              size={'large'}
              onPress={onConfirmStartPress}>
              Yes
            </Button>
          </View>
        </Card>
      </Modal>
    </>
  );
};
