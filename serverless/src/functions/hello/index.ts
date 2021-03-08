import schema from './schema';
import { handlerPath } from '@utilities/handlerResolver';

export const hello = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        request: {
          schema: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
