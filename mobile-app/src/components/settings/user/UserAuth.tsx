import React, { FC, useMemo, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { Button, Modal } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sentenceCase } from 'change-case';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';
import { logoutAsync } from '@reduxApp/auth/actions';

import { LoginModalContent } from './LoginModalContent';
import { ConfirmationModal } from '@components/shared/actionable';
import { renderIcon } from '@components/shared/interface';

import { getBackdropStyle } from '@utilities/functions/ui';
import { useCasingForENTranslation } from '@utilities/hooks';

interface UserAuthProps extends ViewProps {}

export const UserAuth: FC<UserAuthProps> = ({ ...props }) => {
  const { t } = useTranslation('auth');

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

  const text = {
    login: useCasingForENTranslation(t('dev login'), sentenceCase),
    logout: useCasingForENTranslation(t('dev logout'), sentenceCase),
  };

  return (
    <>
      <View {...props}>
        <Button
          appearance={'outline'}
          accessoryLeft={renderIcon('person-outline')}
          onPress={onButtonPress}>
          {isLoggedIn ? text.logout : text.login}
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
