import React, { FC, HTMLAttributes } from 'react';

import { robot } from 'assets/images';

export const ComingSoonPlaceholder: FC<HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => (
  <div {...props}>
    <img src={robot} alt={'robot'} className={'w-40 h-40'} />
    <div className={'mt-3 flex flex-col items-center'}>
      <h1 className={'text-3xl'}>Blue Nebula</h1>
      <h3 className={'mt-2 text-xl'}>Coming Soon</h3>
    </div>
  </div>
);
