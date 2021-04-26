import { Request, Response } from 'express';

import {
  getTokenFromRequest,
  getUserFromRequest,
  invalidateUserToken,
} from '@utilities/auth';

export const logout = async (req: Request, res: Response) => {
  try {
    // get the token
    const token = await getTokenFromRequest(req);

    if (!token) throw new Error('Token is not provided');

    // get user from the request object
    const user = await getUserFromRequest(req);

    const invalidation = await invalidateUserToken(token);
    if (!invalidation) throw new Error('Token invalidation failed.');

    // resolve request
    console.log(`User ${user.username} has successfully logged out!`);
    res.status(200).send('Logout successful.');
  } catch (error) {
    console.log(`Error logging user out:`, error);
    res.status(400).send('Authentication failed.');
  }
};
