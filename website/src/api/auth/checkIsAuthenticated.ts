import axios from 'axios';

import { serverUrl } from 'config/environment';

const url = `${serverUrl.auth}/isAuthenticated`;

export const checkIsAuthenticated = async (
  authenticationToken: string,
): Promise<void> => {
  await axios.get(url, { headers: { authorization: authenticationToken } });
};
