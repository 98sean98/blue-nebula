import 'reflect-metadata';
import { handlerPath } from '@utilities/handlerResolver';

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
