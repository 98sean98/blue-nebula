import React, { FC, useState, useEffect, useMemo } from 'react';
import { Alert, View, ViewProps } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useMutation } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import { UPDATE_MICRO_APP_DATA } from '@api/graphql/microApp';

import { RootState } from '@reduxApp';

import { ConfirmationModal } from '@components/shared/actionable';
import {
  setApplicationError,
  setIsLoading,
} from '@reduxApp/application/actions';

interface MicroAppUpdateProps extends ViewProps {}

export const MicroAppUpdate: FC<MicroAppUpdateProps> = ({ ...props }) => {
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

  const onButtonPress = () => setShowModal(true);

  const onConfirmUpdateMicroApp = () => {
    if (
      // typeof user !== 'undefined' &&
      typeof focusedMicroAppHeaders !== 'undefined'
    ) {
      const name = focusedMicroAppHeaders.name;
      const updaterUsername = user?.username ?? '98sean98';

      const data = { controlEntities, setups, makerConfig };
      const jsonData = JSON.stringify(data);

      const variables = { name, data: jsonData, updaterUsername };

      updateMicroApp({
        variables,
      })
        .then((response) => {
          if (response.data?.updateMicroApp !== null)
            Alert.alert(
              `${itemName} Update Success`,
              `This micro app's data has been updated successfully!`,
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
    console.log({ error });
    if (typeof error !== 'undefined')
      dispatch(
        setApplicationError({
          title: `${itemName} Update Error`,
          message: 'There was an error updating this micro app in the server.',
        }),
      );
  }, [dispatch, error, itemName]);

  return (
    <>
      <View {...props}>
        <Button appearance={'outline'} onPress={onButtonPress}>
          {`Update ${itemName} Data in the Server`}
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
