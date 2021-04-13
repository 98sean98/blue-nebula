import React, { FC, useEffect, useState } from 'react';

import { User } from 'models/user';

import { checkIsAuthenticated } from 'api/auth';

import { AuthContext } from 'utilities/context';
import {
  getTokenFromStorage,
  removeTokenFromStorage,
} from 'utilities/functions';

export const AuthLayer: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  // check if the token exists in the local storage, and validate it
  useEffect(() => {
    const token = getTokenFromStorage();
    if (token !== null)
      checkIsAuthenticated(token)
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          removeTokenFromStorage();
          setIsAuthenticated(false);
        });
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
