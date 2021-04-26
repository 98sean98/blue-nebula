import React from 'react';
import { useHistory } from 'react-router-dom';
import { AlertCircle } from 'react-feather';

import { LoginCredentials } from 'models/auth';

import { login } from 'api/auth';

import { CredentialsInput } from 'components/auth';

import { useAuthContext } from 'utilities/hooks';
import { setTokenIntoStorage } from 'utilities/functions';

import { robot } from 'assets/images';
import colors from 'styles/colors';

export const AuthPage = () => {
  const { setIsAuthenticated } = useAuthContext();

  const history = useHistory();

  const handleSubmit = async (loginCredentials: LoginCredentials) => {
    try {
      // send login request
      const token = await login(loginCredentials);
      // set token into local storage
      setTokenIntoStorage(token);
      // set auth context isAuthenticated state
      setIsAuthenticated(true);
      // redirect
      history.replace('/');
    } catch (error) {
      console.log(error);
      alert('An error occurred logging you in. Please try again.');
    }
  };

  return (
    <div
      className={'w-screen h-screen flex flex-col justify-center items-center'}>
      <div className={'w-full max-w-md p-4'}>
        <div>
          <img src={robot} alt={'robot'} className={'w-28 h-28 mx-auto'} />

          <div className={'mt-2 flex justify-center items-center space-x-2'}>
            <AlertCircle color={colors.warning['500']} />
            <p className={'font-semibold text-center'}>
              Please login to use blue nebula services
            </p>
          </div>
        </div>

        <div className={'mt-6'}>
          <CredentialsInput handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};
