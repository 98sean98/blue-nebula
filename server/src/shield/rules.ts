import { rule } from 'graphql-shield';

import { Context } from '@src/createContext';

export const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: Context) => {
    return ctx.auth.isAuthenticated;
  },
);
