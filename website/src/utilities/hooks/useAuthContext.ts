import { useContext } from 'react';

import { AuthContext } from 'utilities/context';

export const useAuthContext = () => useContext(AuthContext);
