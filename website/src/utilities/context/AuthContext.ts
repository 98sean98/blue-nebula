import { createContext, Dispatch, SetStateAction } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};

const initialAuthContext: AuthContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
};

export const AuthContext = createContext(initialAuthContext);
