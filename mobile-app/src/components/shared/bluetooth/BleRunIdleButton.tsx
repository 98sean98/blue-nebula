import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Button, ButtonProps, Card, Modal, Text } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sentenceCase } from 'change-case';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

import { renderBleErrorAlert } from '@components/shared/bluetooth/renderBleErrorAlert';
import { ControlEntitySummary } from '@components/shared/interface';
import { ConfirmationButtonGroup } from '@components/shared/actionable';
import { ActionTreePathSummary } from '@components/controller/simple';

import {
  useBleRpiDeviceCharacteristic,
  useControlEntities,
  useSimpleControllerContext,
  useCasingForENTranslation,
} from '@utilities/hooks';

interface BleRunIdleButtonProps extends Omit<ButtonProps, 'onPress'> {
  showVerbose?: boolean;
  onStateChange?: (isRunning: boolean) => void;
}

export const BleRunIdleButton: FC<BleRunIdleButtonProps> = ({
  showVerbose,
  onStateChange,
  ...props
}) => {
  const { t } = useTranslation('control');

  const { controlEntities } = useSelector((state: RootState) => state.control);
  const { actionTreePath } = useSimpleControllerContext();

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
      // write all control entities to device if the next state is to run
      if (!isRunning) await writeAll();
      // pop the confirmation modal
      setShouldShowModal(true);
    } catch (error) {
      console.log(error);
      renderBleErrorAlert({
        title: 'Data Communication Error',
        message: 'There was something wrong with communicating the device.',
      });
    }
  };

  const onConfirmPress = useCallback(async () => {
    try {
      const nextRunningState = !isRunning;
      await write(nextRunningState);
    } catch (error) {
      console.log(error);
      renderBleErrorAlert({
        title: `Confirm ${isRunning ? 'Stop' : 'Start'} Error`,
        message:
          'There was something wrong with confirming to start the device.',
      });
    } finally {
      setShouldShowModal(false);
    }
  }, [write, isRunning]);

  const text = useMemo(
    () => ({
      readyTo: t('run/idle.Are you ready to'),
      start: t('run/idle.start'),
      stop: t('run/idle.stop'),
    }),
    [t],
  );

  return (
    <>
      <Button
        status={isRunning ? 'danger' : 'primary'}
        {...props}
        onPress={onButtonPress}>
        {useCasingForENTranslation(
          isRunning ? text.stop : text.start,
          sentenceCase,
        )}
      </Button>

      <Modal
        visible={shouldShowModal}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setShouldShowModal(false)}
        style={[tailwind('w-4/5')]}>
        <Card disabled style={tailwind('m-4')}>
          <Text category={'h5'} style={tailwind('text-center')}>
            {`${text.readyTo} ${isRunning ? text.stop : text.start} ?`}
          </Text>
          {!isRunning ? (
            showVerbose ? (
              <ScrollView
                style={{ maxHeight: Dimensions.get('window').height * 0.6 }}
                showsVerticalScrollIndicator={false}>
                <ControlEntitySummary
                  style={tailwind('mt-2')}
                  controlEntities={controlEntities}
                />
              </ScrollView>
            ) : (
              <ActionTreePathSummary
                actionTreePath={actionTreePath}
                style={tailwind('mt-4 mx-2')}
              />
            )
          ) : null}

          <ConfirmationButtonGroup
            onNoPress={() => setShouldShowModal(false)}
            onYesPress={onConfirmPress}
            style={tailwind('mt-3')}
          />
        </Card>
      </Modal>
    </>
  );
};
