import axios from 'axios';

import { serverUrl } from '@config/environment';

const url = `${serverUrl.auth}/isAuthenticated`;

export const isAuthenticated = async (authenticationToken: string) => {
  await axios.get(url, { headers: { authorization: authenticationToken } });
};
