import { Ctx, Query, Resolver } from 'type-graphql';

import { User } from '@artifacts/type-graphql';
import { Context } from '@graphql-api/createContext';

@Resolver()
export class MeUserResolver {
  @Query(() => User)
  async me(@Ctx() context: Context): Promise<User> {
    const user = context.auth.user;
    if (typeof user === 'undefined')
      throw new Error('User is not authenticated. This is a no-op.');
    return user;
  }
}
