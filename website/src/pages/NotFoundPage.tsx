import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'react-feather';

import colors from 'styles/colors';

export const NotFoundPage: FC = () => {
  return (
    <div
      className={'w-screen h-screen flex flex-col justify-center items-center'}>
      <AlertTriangle size={40} color={colors.warning['500']} />
      <h1 className={'mt-2 text-3xl'}>404 Not Found</h1>
      <button className={'mt-6 btn btn-primary'}>
        <Link to={'/'}>Back to home page</Link>
      </button>
    </div>
  );
};
