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

  return {
    prisma,
    auth: {
      user: user,
      isAuthenticated: typeof user !== 'undefined',
    },
  };
};
