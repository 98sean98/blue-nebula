import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { Alert, View, ViewProps } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useMutation, useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import {
  GET_LATEST_MICRO_APP_DATA_VERSION,
  UPDATE_MICRO_APP_DATA,
} from '@api/graphql/microApp';

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

  const versionQueryVariables = useMemo(
    () => ({ name: focusedMicroAppHeaders?.name }),
    [focusedMicroAppHeaders],
  );

  const { data: versionData, error: versionError } = useQuery(
    GET_LATEST_MICRO_APP_DATA_VERSION,
    {
      variables: versionQueryVariables,
      fetchPolicy: 'network-only',
      pollInterval: 5000,
    },
  );
  const [
    updateMicroApp,
    { loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_MICRO_APP_DATA, {
    refetchQueries: [
      {
        query: GET_LATEST_MICRO_APP_DATA_VERSION,
        variables: versionQueryVariables,
      },
    ],
    awaitRefetchQueries: true,
  });

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

  const onConfirmUpdateMicroApp = async () => {
    try {
      if (
        typeof user !== 'undefined' &&
        typeof focusedMicroAppHeaders !== 'undefined'
      ) {
        const name = focusedMicroAppHeaders.name;
        const updaterUsername = user?.username;

        if (typeof updaterUsername === 'undefined') {
          // no-op as the user should be logged in, and their information is stored in redux
          dispatchError();
          return;
        }

        const newVersion = versionData?.aggregateMicroAppData
          ? versionData.aggregateMicroAppData.max.version + 1
          : 1;
        const data = { controlEntities, setups, makerConfig };
        const jsonData = JSON.stringify(data);

        const variables = {
          name,
          version: newVersion,
          data: jsonData,
          updaterUsername,
        };

        const response = await updateMicroApp({
          variables,
        });
        if (response.data?.updateMicroApp !== null)
          Alert.alert(
            `${itemName} Backup Success`,
            `This micro app's data has been backed up successfully!`,
          );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setShowModal(false);
    }
  };

  // loading effect
  useEffect(() => {
    dispatch(setIsLoading(updateLoading));
  }, [dispatch, updateLoading]);

  // error effect
  useEffect(() => {
    if (
      typeof versionError !== 'undefined' ||
      typeof updateError !== 'undefined'
    )
      dispatchError();
  }, [dispatchError, versionError, updateError]);

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
