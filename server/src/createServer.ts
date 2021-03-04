import { ApolloServer } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { PrismaClient } from '@prisma/client';

import { createSchema } from './createSchema';
// import { permissions } from './shield/permissions';
// import { createContext } from './context';

const prisma = new PrismaClient();

export const createServer = async () => {
  const schema = await createSchema();

  return new ApolloServer({
    schema: applyMiddleware(
      schema,
      // permissions
    ),
    context: () => ({
      prisma,
    }),
    // createContext(req);
    playground: true,
    debug: process.env.NODE_ENV === 'development',
  });
};
