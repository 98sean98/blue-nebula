import { ApolloServer } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';

import { createSchema } from './createSchema';
import { createContext } from './createContext';
import { permissions } from '@shield/permissions';

export const createServer = async () => {
  const schema = await createSchema();

  return new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    context: ({ req }) => createContext(req),
    playground: true,
    introspection: true,
    debug: process.env.NODE_ENV === 'development',
  });
};
