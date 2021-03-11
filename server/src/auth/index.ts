import express, { Request, Router } from 'express';
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

    console.log(`User ${username} is attempting to login...`);

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

    // resolve request by sending the token
    console.log(`User ${username} has successfully logged in!`);
    res.status(200).send(token);
  } catch (error) {
    console.log('Error logging user in:', error);
    res.status(400).send('Authentication failed.');
  }
});

router.post('/logout', async (req, res) => {
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
});

router.get('/isAuthenticated', async (req, res) => {
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
});

const getUserFromRequest = async (req: Request): Promise<User> => {
  // find the session, and resolve for the user from the request token
  const token = getTokenFromRequest(req);

  if (typeof token === 'undefined') throw new Error('Missing token.');

  const user = await verifyUserToken(token);

  if (typeof user === 'undefined') throw new Error('User cannot be found.');

  return user;
};

export { router as auth };
