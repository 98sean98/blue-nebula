import axios from 'axios';

import { serverUrl } from '@config/environment';

import { LoginCredentials } from '@models/auth';

const url = `${serverUrl.auth}/login`;

export const login = async (credentials: LoginCredentials): Promise<string> => {
  const response = await axios.post(url, credentials);
  return response.data;
};
