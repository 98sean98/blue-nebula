import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';

import { generateToken } from '@utilities/auth/token';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
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
};
