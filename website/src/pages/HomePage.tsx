import React, { FC } from 'react';

import { PageContainerWithNavBar } from 'components/shared/interface';
import { Usage } from 'components/micro-app';

export const HomePage: FC = () => {
  return (
    <PageContainerWithNavBar className={'h-screen flex flex-col'}>
      <Usage microAppId={'093919f4-77aa-4489-a1b6-23795eda0a48'} />
    </PageContainerWithNavBar>
  );
};
