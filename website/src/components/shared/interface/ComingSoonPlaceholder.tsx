import React, { FC, HTMLAttributes } from 'react';

import { combineClassNames } from 'utilities/functions';

export const ComingSoonPlaceholder: FC<HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => (
  <div
    {...props}
    className={combineClassNames(
      'text-center animate-bounce',
      props?.className,
    )}>
    <h1 className={'mt-2 text-3xl'}>Coming Soon</h1>
  </div>
);
