import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: FC = () => {
  return (
    <div
      className={'w-screen h-screen flex flex-col justify-center items-center'}>
      <h1 className={'text-3xl'}>404 Not Found</h1>
      <Link to={'/'} className={'mt-4 text-primary-500 underline'}>
        Back to home page
      </Link>
    </div>
  );
};
