import React, { FC, useState } from 'react';
import { Card, Input, CardProps } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { LoginCredentials } from '@models/auth';

import { loginAsync } from '@reduxApp/auth/actions';

import { ConfirmationButtonGroup } from '@components/shared/actionable';

interface LoginModalContentProps extends CardProps {
  closeModal: () => void;
}

export const LoginModalContent: FC<LoginModalContentProps> = ({
  closeModal,
  ...props
}) => {
  const dispatch = useDispatch();

  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });

  const doLogin = () => {
    dispatch(loginAsync(loginCredentials));
    setLoginCredentials({ username: '', password: '' });
    closeModal();
  };

  return (
    <Card disabled {...props}>
      <Input
        label={'Username'}
        onChangeText={(text) =>
          setLoginCredentials({ ...loginCredentials, username: text })
        }
      />
      <Input
        label={'Password'}
        onChangeText={(text) =>
          setLoginCredentials({ ...loginCredentials, password: text })
        }
        style={tailwind('mt-2')}
      />
      <ConfirmationButtonGroup onNoPress={closeModal} onYesPress={doLogin} />
    </Card>
  );
};
