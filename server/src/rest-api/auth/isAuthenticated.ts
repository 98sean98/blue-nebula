import { Request, Response } from 'express';

import { getUserFromRequest } from '@utilities/auth';

export const isAuthenticated = async (req: Request, res: Response) => {
  try {
    // try to get user from the request object
    const user = await getUserFromRequest(req);

    // if no errors, resolve request
    console.log(`User ${user.username} just checked his / her authentication.`);
    res.status(200).send('User is authenticated.');
  } catch (error) {
    console.log('Error checking user authentication:', error);
    res.status(400).send('Authentication failed.');
  }
};
