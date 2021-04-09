import React, { FC, HTMLAttributes } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { combineClassNames } from 'utilities/functions';
import { useAuthContext } from 'utilities/hooks';

import { robot } from 'assets/images';

interface NavBarProps extends HTMLAttributes<HTMLDivElement> {}

export const NavBar: FC<NavBarProps> = ({ ...props }) => {
  const history = useHistory();

  const onBrandClick = () => history.push('/');

  const { isAuthenticated } = useAuthContext();

  return (
    <div
      {...props}
      className={combineClassNames(
        'w-full h-10 md:h-12 lg:h-16 flex flex-row justify-between items-center px-4',
        props?.className,
      )}>
      <div
        className={'h-full flex flex-row items-center space-x-2 cursor-pointer'}
        onClick={onBrandClick}>
        <img src={robot} alt={'robot'} className={'h-full m-1'} />
        <h1 className={'md:text-lg lg:text-2xl xl:text-3xl'}>Blue Nebula</h1>
      </div>
      <div>{isAuthenticated ? <Link to={'/auth'}>Login</Link> : null}</div>
    </div>
  );
};
