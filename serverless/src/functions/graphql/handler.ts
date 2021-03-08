import { APIGatewayProxyHandler } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';
import { applyMiddleware } from 'graphql-middleware';
import { PrismaClient } from '@prisma/client';

import { graphqlSchema } from '@schema/graphqlSchema';

const prisma = new PrismaClient();

const server = new ApolloServer({
  schema: applyMiddleware(graphqlSchema),
  context: ({ event, context }) => ({
    headers: event.headers,
    event,
    context,
    prisma,
  }),
  playground: {
    endpoint: '/dev/graphql',
  },
  debug: process.env.NODE_ENV === 'development',
});

export const main: APIGatewayProxyHandler = server.createHandler();
