import { Arg, createUnionType, Ctx, Query, Resolver } from 'type-graphql';

import { SimpleUser, User } from '@artifacts/type-graphql';
import { Context } from '@graphql-api/createContext';

const MeUnion = createUnionType({
  name: 'Me',
  types: () => [User, SimpleUser] as const,
  resolveType: (value) => {
    if ('username' in value) return User;
    if ('identifier' in value) return SimpleUser;
    return undefined;
  },
});

@Resolver()
export class MeResolver {
  @Query(() => MeUnion)
  async me(
    @Ctx() { prisma, auth }: Context,
    @Arg('identifier', { nullable: true }) identifier?: string,
  ): Promise<typeof MeUnion> {
    const { user } = auth;

    // user exists in the context, and is authenticated
    if (typeof user !== 'undefined') return user;

    // user does not exist in the context
    // if the identifier is not provided, throw error
    if (typeof identifier === 'undefined')
      throw new Error(
        'User is not authenticated, and an identifier is not provided. This is a no-op.',
      );

    // find the simple user using the identifier
    const simpleUser = await prisma.simpleUser.findUnique({
      where: { identifier },
    });

    // if the simple user cannot be found, throw error
    if (simpleUser === null)
      throw new Error(
        'Simple user cannot be found with the provided identifier.',
      );

    // return the simple user
    return simpleUser;
  }
}
