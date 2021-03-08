import 'reflect-metadata';
import { handlerPath } from '@libs/handlerResolver';

export const graphql = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'graphql',
      },
    },
    {
      http: {
        method: 'post',
        path: 'graphql',
      },
    },
  ],
};
