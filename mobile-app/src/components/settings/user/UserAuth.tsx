import React, { FC, useMemo, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { Button, Modal } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

import { LoginModalContent } from './LoginModalContent';
import { ConfirmationModal } from '@components/shared/actionable';

interface UserAuthProps extends ViewProps {}

export const UserAuth: FC<UserAuthProps> = ({ ...props }) => {
  const authorizationToken = useSelector(
    (state: RootState) => state.auth.authorizationToken,
  );

  const isLoggedIn = useMemo(() => typeof authorizationToken !== 'undefined', [
    authorizationToken,
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);

  const onButtonPress = () => setShowModal(true);

  // todo: use the dispatch logout action
  const doLogout = () => {};

  const closeModal = () => setShowModal(false);

  return (
    <>
      <View {...props}>
        <Button appearance={'ghost'} onPress={onButtonPress}>
          Login
        </Button>
      </View>

      {/* modal */}
      <Modal
        visible={!isLoggedIn && showModal}
        onBackdropPress={closeModal}
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
