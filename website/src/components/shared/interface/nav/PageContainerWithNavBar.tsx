import React, { FC, HTMLAttributes } from 'react';

import { NavBar } from './NavBar';

import { combineClassNames } from 'utilities/functions';

interface PageContainerWithNavBarProps extends HTMLAttributes<HTMLDivElement> {
  overridingClassName?: string;
}

export const PageContainerWithNavBar: FC<PageContainerWithNavBarProps> = ({
  overridingClassName,
  children,
  ...props
}) => (
  <div
    className={
      overridingClassName ??
      combineClassNames('container mx-auto', props?.className)
    }>
    <NavBar />
    {children}
  </div>
);
