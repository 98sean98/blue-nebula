import Cookies from 'universal-cookie';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { PrismaClient, Session, User } from '@prisma/client';

const prisma = new PrismaClient();

export const generateToken = (session: Session): string => {
  const secret = process.env.APPLICATION_SECRET;
  if (typeof secret === 'undefined')
    throw new Error(
      'APPLICATION_SECRET is missing in the runtime environment.',
    );

  return jwt.sign(session.id, secret);
};

const findSession = async (token: string): Promise<Session | undefined> => {
  const secret = process.env.APPLICATION_SECRET;
  if (typeof secret === 'undefined')
    throw new Error(
      'APPLICATION_SECRET is missing in the runtime environment.',
    );

  const sessionId = jwt.verify(token, secret) as string;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  return session ?? undefined;
};

export const verifyUserToken = async (
  token: string,
): Promise<User | undefined> => {
  try {
    const session = await findSession(token);

    if (!session || !session.userId) throw new Error('No session found.');

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) throw new Error('No unique user found.');

    return user;
  } catch (error) {
    console.log(`Error verifying user token:`, error);
    return;
  }
};

export const invalidateUserToken = async (token: string): Promise<boolean> => {
  try {
    // delete the user session according to token
    const session = await findSession(token);

    if (!session) throw new Error('No session found.');

    await prisma.session.delete({ where: { id: session.id } });
    return true;
  } catch (error) {
    console.log(`Error invalidating user tokens:`, error);
    return false;
  }
};

export const getTokenFromRequest = (req: Request): string | undefined => {
  const cookies = new Cookies(req && req.headers && req.headers.cookie);
  const cookieToken: string = cookies.get('APPLICATION_USER');
  const fallbackToken = req && req.headers && req.headers.authorization;
  return cookieToken || fallbackToken;
};
