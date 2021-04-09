import React, { FC } from 'react';

import {
  ComingSoonPlaceholder,
  PageContainerWithNavBar,
} from 'components/shared/interface';

export const HomePage: FC = () => {
  return (
    <PageContainerWithNavBar className={'h-screen flex flex-col'}>
      <div className={'h-full flex flex-col justify-center items-center'}>
        <ComingSoonPlaceholder />
      </div>
    </PageContainerWithNavBar>
  );
};
