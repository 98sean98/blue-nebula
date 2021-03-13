import { Request } from 'express';
import { User } from '@prisma/client';

import { getTokenFromRequest, verifyUserToken } from '@utilities/auth/token';

export const getUserFromRequest = async (req: Request): Promise<User> => {
  // find the session, and resolve for the user from the request token
  const token = getTokenFromRequest(req);

  if (typeof token === 'undefined') throw new Error('Missing token.');

  const user = await verifyUserToken(token);

  if (typeof user === 'undefined') throw new Error('User cannot be found.');

  return user;
};
