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

export const verifyUserToken = async (
  token: string,
): Promise<User | undefined> => {
  try {
    const secret = process.env.APPLICATION_SECRET;
    if (typeof secret === 'undefined')
      throw new Error(
        'APPLICATION_SECRET is missing in the runtime environment.',
      );

    const sessionId = jwt.verify(token, secret) as string;

    const _session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!_session || !_session.userId) throw new Error('No session found.');

    const user = await prisma.user.findUnique({
      where: { id: _session.userId },
    });

    if (!user) throw new Error('No unique user found.');

    return user;
  } catch (error) {
    console.log(`Error verifying user token:`, error);
    return;
  }
};

export const invalidateUserTokens = async (
  userId: string,
): Promise<boolean> => {
  try {
    // delete all user sessions so that all tokens related to this user cannot be found by virtue of sessions that do not exist
    await prisma.session.deleteMany({ where: { userId } });
    return true;
  } catch (error) {
    console.log(`Invalidating user tokens.`, error);
    return false;
  }
};

export const getTokenFromRequest = (req: Request): string | undefined => {
  const cookies = new Cookies(req && req.headers && req.headers.cookie);
  const cookieToken: string = cookies.get('APPLICATION_USER');
  const fallbackToken = req && req.headers && req.headers.authorization;
  return cookieToken || fallbackToken;
};
