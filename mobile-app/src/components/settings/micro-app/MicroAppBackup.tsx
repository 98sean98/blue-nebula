import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { Alert, View, ViewProps } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useMutation } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import { UPDATE_MICRO_APP_DATA } from '@api/graphql/microApp';

import { RootState } from '@reduxApp';
import {
  setApplicationError,
  setIsLoading,
} from '@reduxApp/application/actions';

import { ConfirmationModal } from '@components/shared/actionable';
import { renderIcon } from '@components/shared/interface';

interface MicroAppBackupProps extends ViewProps {}

export const MicroAppBackup: FC<MicroAppBackupProps> = ({ ...props }) => {
  const dispatch = useDispatch();

  const {
    application: { focusedMicroAppHeaders },
    auth: { user },
    builder: { setups, makerConfig },
    control: { controlEntities },
  } = useSelector((state: RootState) => state);

  const [updateMicroApp, { loading, error }] = useMutation(
    UPDATE_MICRO_APP_DATA,
  );

  const [showModal, setShowModal] = useState<boolean>(false);

  const itemName = useMemo(() => focusedMicroAppHeaders?.name ?? 'Micro App', [
    focusedMicroAppHeaders,
  ]);

  const dispatchError = useCallback(
    () =>
      dispatch(
        setApplicationError({
          title: `${itemName} Backup Error`,
          message:
            'There was an error backing this micro app up to the server.',
        }),
      ),
    [dispatch, itemName],
  );

  const onButtonPress = () => setShowModal(true);

  const onConfirmUpdateMicroApp = () => {
    if (
      // typeof user !== 'undefined' &&
      typeof focusedMicroAppHeaders !== 'undefined'
    ) {
      const name = focusedMicroAppHeaders.name;
      const updaterUsername = user?.username;

      if (typeof updaterUsername === 'undefined') {
        // no-op as the user should be logged in, and their information is stored in redux
        dispatchError();
        return;
      }

      const data = { controlEntities, setups, makerConfig };
      const jsonData = JSON.stringify(data);

      const variables = { name, data: jsonData, updaterUsername };

      updateMicroApp({
        variables,
      })
        .then((response) => {
          if (response.data?.updateMicroApp !== null)
            Alert.alert(
              `${itemName} Backup Success`,
              `This micro app's data has been backed up successfully!`,
            );
        })
        .catch((e) => console.log(e));
    }
    setShowModal(false);
  };

  // loading effect
  useEffect(() => {
    dispatch(setIsLoading(loading));
  }, [dispatch, loading]);

  // error effect
  useEffect(() => {
    if (typeof error !== 'undefined') dispatchError();
  }, [dispatchError, error]);

  return (
    <>
      <View {...props}>
        <Button
          appearance={'outline'}
          accessoryLeft={renderIcon('cloud-upload-outline')}
          onPress={onButtonPress}>
          {`Backup ${itemName} data to the server`}
        </Button>
      </View>

      {/* confirmation modal */}
      <ConfirmationModal
        visible={showModal}
        onBackdropPress={() => setShowModal(false)}
        action={'update'}
        itemName={itemName}
        onYesPress={onConfirmUpdateMicroApp}
      />
    </>
  );
};
