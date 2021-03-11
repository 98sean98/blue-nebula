import { serverUrl } from '@config/environment';
import axios from 'axios';

const url = `${serverUrl.auth}/logout`;

export const logout = async (authorizationToken: string): Promise<void> => {
  await axios.post(url, undefined, {
    headers: { authorization: authorizationToken },
  });
};
