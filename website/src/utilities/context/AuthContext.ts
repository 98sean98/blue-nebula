import { createContext, Dispatch, SetStateAction } from 'react';

import { User } from 'models/auth';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
};

const initialAuthContext: AuthContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: undefined,
  setUser: () => {},
};

export const AuthContext = createContext(initialAuthContext);
