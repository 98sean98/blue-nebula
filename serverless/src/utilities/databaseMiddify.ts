import { Client } from 'pg';
import { APIGatewayProxyHandler } from 'aws-lambda';
import middy from '@middy/core';
import { HandlerLambda } from 'middy';

const connectionString = process.env.DATABASE_URL;

export const databaseMiddleware = () => ({
  before: async (
    { callback }: HandlerLambda,
    next: Function,
  ): Promise<void> => {
    try {
      const client = new Client({ connectionString });
      await client.connect();
      await client.end();
    } catch (error) {
      console.log('Database is not connected.', error);
      callback(null, 'Internal server error');
      return;
    }

    next();
  },
});

export const databaseMiddify = (handler: APIGatewayProxyHandler) =>
  middy(handler).use(databaseMiddleware());
