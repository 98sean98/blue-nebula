import React, { FC } from 'react';

import { ComingSoonPlaceholder } from 'components/shared/interface';

export const HomePage: FC = () => {
  return (
    <div
      className={'w-screen h-screen flex flex-col justify-center items-center'}>
      <ComingSoonPlaceholder />
    </div>
  );
};
