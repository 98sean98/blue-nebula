import React, { FC } from 'react';

import { PageContainerWithNavBar } from 'components/shared/interface';
import { MicroApps } from 'components/micro-app';

import { useAuthContext } from 'utilities/hooks';

export const HomePage: FC = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <PageContainerWithNavBar className={'h-screen flex flex-col'}>
      {isAuthenticated ? (
        <MicroApps className={'flex-grow my-4'} />
      ) : (
        <div className={'flex-grow flex justify-center items-center'}>
          <h1 className={'text-2xl'}>Please login.</h1>
        </div>
      )}
    </PageContainerWithNavBar>
  );
};
