import React from 'react';
import { AlertCircle } from 'react-feather';

import { CredentialsInput } from 'components/auth';

import colors from 'styles/colors';

export const AuthPage = () => {
  return (
    <div
      className={'w-screen h-screen flex flex-col justify-center items-center'}>
      <div className={'w-full max-w-md m-4'}>
        <div className={'flex space-x-2'}>
          <AlertCircle color={colors.warning['500']} />
          <p className={'text-lg'}>Please login to use blue nebula services</p>
        </div>
        <div className={'mt-6'}>
          <CredentialsInput
            handleSubmit={(credentials) => console.log(credentials)}
          />
        </div>
      </div>
    </div>
  );
};
