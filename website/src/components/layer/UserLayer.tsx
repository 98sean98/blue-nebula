import React, { FC, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import { GET_ME } from 'api/graphql/user';

import { useAuthContext } from 'utilities/hooks';

export const UserLayer: FC = ({ children }) => {
  const { isAuthenticated, setUser } = useAuthContext();

  const [getMe, { data }] = useLazyQuery(GET_ME);

  useEffect(() => {
    if (isAuthenticated) getMe();
    else setUser(undefined);
  }, [isAuthenticated, setUser, getMe]);

  useEffect(() => {
    if (
      typeof data !== 'undefined' &&
      data.me !== null &&
      data.me.__typename === 'User'
    ) {
      setUser(data.me);
    }
  }, [data, setUser]);

  return <>{children}</>;
};
