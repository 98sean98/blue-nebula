import { APIGatewayProxyHandler } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';
import { applyMiddleware } from 'graphql-middleware';
import { PrismaClient } from '@prisma/client';

import { graphqlSchema } from '@schema/graphqlSchema';

import { databaseMiddify } from '@utilities/databaseMiddify';

const prisma = new PrismaClient();

const endpoint = `/${process.env.STAGE}/graphql`;

const server = new ApolloServer({
  schema: applyMiddleware(graphqlSchema),
  context: ({ event, context }) => ({
    headers: event.headers,
    event,
    context,
    prisma,
  }),
  playground: {
    endpoint,
  },
  debug: process.env.STAGE !== 'production',
});

export const main: APIGatewayProxyHandler = databaseMiddify(
  server.createHandler(),
);
