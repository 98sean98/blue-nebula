import { Request } from 'express';
import { PrismaClient, User } from '@prisma/client';

import { getTokenFromRequest, verifyUserToken } from '@utilities/auth/token';

const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
  auth: {
    user: User | undefined;
    isAuthenticated: boolean;
  };
};

export const createContext = async (req: Request): Promise<Context> => {
  const token = getTokenFromRequest(req);

  let user: User | undefined;
  if (typeof token !== 'undefined') user = await verifyUserToken(token);

  if (typeof user !== 'undefined')
    console.log(`User ${user.username} is calling the graphql endpoint.`);
  else console.log(`An unknown user is calling the graphql endpoint.`);

  return {
    prisma,
    auth: {
      user: user,
      isAuthenticated: typeof user !== 'undefined',
    },
  };
};
