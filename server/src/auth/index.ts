import express, { Request, Response, Router } from 'express';
import { PrismaClient, User } from '@prisma/client';

import {
  generateToken,
  getTokenFromRequest,
  invalidateUserTokens,
  verifyUserToken,
} from '@utilities/auth/token';

const prisma = new PrismaClient();

// eslint-disable-next-line new-cap
const router: Router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(`User with ${username} is attempting to login...`);

    if (typeof username === 'undefined' || username === '')
      throw new Error('Username is not provided.');
    if (
      typeof password === 'undefined' ||
      password !== process.env.APPLICATION_MASTER_PASSWORD
    )
      throw new Error('Password does not match.');

    // find user in database using prisma
    const user: User | null = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log('Error: User is not registered.');
      res.status(401).send('User is not registered.');
      return;
    }

    // create user session and token
    const session = await prisma.session.create({
      data: { user: { connect: { id: user.id } } },
    });
    const token = generateToken(session);

    console.log(`User with ${username} has successfully logged in...`);

    res.status(200).send(token);
  } catch (error) {
    console.log('Error logging user in:', error);
    res.status(400).send('Authentication failed.');
  }
});

router.post('/logout', async (_req: Request, res: Response) => {
  try {
    // find the session, and resolve for the user from the request token
    const token = getTokenFromRequest(_req);

    if (typeof token === 'undefined') throw new Error('Missing token.');

    const user = await verifyUserToken(token);

    if (typeof user === 'undefined') throw new Error('User cannot be found.');

    const invalidation = await invalidateUserTokens(user.id);
    if (!invalidation) throw new Error('Tokens invalidation failed.');

    res.status(200).send('Logout successful.');
  } catch (error) {
    console.log(`Error logging user out:`, error);
    res.status(400).send('Authentication failed.');
  }
});

export { router as auth };
