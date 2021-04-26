import React, { FC, HTMLAttributes } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { logout } from 'api/auth';

import {
  combineClassNames,
  getTokenFromStorage,
  removeTokenFromStorage,
} from 'utilities/functions';
import { useAuthContext } from 'utilities/hooks';

import { robot } from 'assets/images';

interface NavBarProps extends HTMLAttributes<HTMLDivElement> {}

export const NavBar: FC<NavBarProps> = ({ ...props }) => {
  const history = useHistory();

  const onBrandClick = () => history.push('/');

  const { isAuthenticated, setIsAuthenticated } = useAuthContext();

  const onLogoutButtonClick = async () => {
    try {
      const token = getTokenFromStorage();

      if (token === null)
        throw new Error(
          'Token does not exist in the local storage. This is a no-op.',
        );

      await logout(token);

      // remove token from storage, and set is authenticated state
      removeTokenFromStorage();
      setIsAuthenticated(false);

      // navigate to home page
      history.push('/');
    } catch (error) {
      console.log(error);
      alert('There was an error logging you out. Please try again.');
    }
  };

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
        <div className={'h-full p-1'}>
          <img src={robot} alt={'robot'} className={'h-full'} />
        </div>
        <h1 className={'text-lg lg:text-2xl xl:text-3xl'}>Blue Nebula</h1>
      </div>
      <div>
        {!isAuthenticated ? (
          <Link className={'text-base'} to={'/auth'}>
            Login
          </Link>
        ) : (
          <Link className={'text-base'} to={'/'} onClick={onLogoutButtonClick}>
            Logout
          </Link>
        )}
      </div>
    </div>
  );
};
