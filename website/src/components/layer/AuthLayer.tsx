import React, { FC, useEffect, useState } from 'react';

import { checkIsAuthenticated } from 'api/auth';

import { AuthContext } from 'utilities/context';
import {
  getTokenFromStorage,
  removeTokenFromStorage,
} from 'utilities/functions';

export const AuthLayer: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
