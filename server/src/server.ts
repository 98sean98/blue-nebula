import { ApolloServer } from 'apollo-server-express';
// import { applyMiddleware } from 'graphql-middleware';
// import { schema } from './api';
// import { permissions } from './shield/permissions';
// import { createContext } from './context';

export const server = new ApolloServer({
  // schema: applyMiddleware(schema,
  //     // permissions
  // ),
  // context: ({ req }) => {
  //     return createContext(req);
  // },
  playground: true,
  debug: process.env.NODE_ENV === 'development',
});
