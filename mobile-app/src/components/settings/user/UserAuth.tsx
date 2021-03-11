import React, { FC, useMemo, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { Button, Modal } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

import { LoginModalContent } from './LoginModalContent';
import { ConfirmationModal } from '@components/shared/actionable';

import { getBackdropStyle } from '@utilities/functions/ui';
import { logoutAsync } from '@reduxApp/auth/actions';
import { renderIcon } from '@components/shared/interface';

interface UserAuthProps extends ViewProps {}

export const UserAuth: FC<UserAuthProps> = ({ ...props }) => {
  const dispatch = useDispatch();

  const authorizationToken = useSelector(
    (state: RootState) => state.auth.authorizationToken,
  );

  const isLoggedIn = useMemo(() => typeof authorizationToken !== 'undefined', [
    authorizationToken,
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);

  const onButtonPress = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  const doLogout = () => {
    dispatch(logoutAsync());
    closeModal();
  };

  return (
    <>
      <View {...props}>
        <Button
          appearance={'outline'}
          accessoryLeft={renderIcon('person-outline')}
          onPress={onButtonPress}>
          {isLoggedIn ? `Dev Logout` : `Dev Login`}
        </Button>
      </View>

      {/* modal */}
      <Modal
        visible={!isLoggedIn && showModal}
        onBackdropPress={closeModal}
        backdropStyle={getBackdropStyle()}
        style={tailwind('w-2/3')}>
        <LoginModalContent closeModal={closeModal} />
      </Modal>

      <ConfirmationModal
        visible={isLoggedIn && showModal}
        onBackdropPress={closeModal}
        action={'logout'}
        onYesPress={doLogout}
      />
    </>
  );
};
