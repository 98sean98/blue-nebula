import React, { FC, useState } from 'react';

import { AuthContext } from 'utilities/context';

export const AuthLayer: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
