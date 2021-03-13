import { Request, Response } from 'express';

import { getUserFromRequest, invalidateUserTokens } from '@utilities/auth';

export const logout = async (req: Request, res: Response) => {
  try {
    // get user from the request object
    const user = await getUserFromRequest(req);

    const invalidation = await invalidateUserTokens(user.id);
    if (!invalidation) throw new Error('Tokens invalidation failed.');

    // resolve request
    console.log(`User ${user.username} has successfully logged out!`);
    res.status(200).send('Logout successful.');
  } catch (error) {
    console.log(`Error logging user out:`, error);
    res.status(400).send('Authentication failed.');
  }
};
