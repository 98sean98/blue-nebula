import React from 'react';
import { AlertCircle } from 'react-feather';

import { CredentialsInput } from 'components/auth';

import colors from 'styles/colors';
import { robot } from '../assets/images';

export const AuthPage = () => {
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
          <CredentialsInput
            handleSubmit={(credentials) => console.log(credentials)}
          />
        </div>
      </div>
    </div>
  );
};
