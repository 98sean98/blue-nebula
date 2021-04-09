import React, { FC, useEffect, useState } from 'react';

import { checkIsAuthenticated } from 'api/auth';

import { AuthContext } from 'utilities/context';

export const AuthLayer: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('authorizationToken');
    if (token !== null)
      checkIsAuthenticated(token)
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem('authorizationToken');
          setIsAuthenticated(false);
        });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
