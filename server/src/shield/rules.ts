import { rule } from 'graphql-shield';

import { Context } from '@graphql-api/createContext';

export const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: Context) => {
    return ctx.auth.isAuthenticated;
  },
);
