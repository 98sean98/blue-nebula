import { Request } from 'express';
// import Cookies from "universal-cookie";
// import { resolveUserUsingJWT } from "./utils/resolveUser";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
  // token: string;
  auth: {
    // user: User;
    isAuthenticated: boolean;
  };
};

export const createContext = async (req: Request): Promise<Context> => {
  // const cookies = new Cookies(req && req.headers && req.headers.cookie);
  // const cookieToken: string = cookies.get("RCTC_USER");
  // const fallbackToken = req && req.headers && req.headers.authorization;
  // const token: string = cookieToken || fallbackToken;
  // const user = await resolveUserUsingJWT(prisma, token);

  console.log({ req });

  return {
    prisma,
    // token,
    auth: {
      // user: user,
      isAuthenticated: false,
    },
  };
};
