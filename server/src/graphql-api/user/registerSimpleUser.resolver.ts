import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { SimpleUser, SimpleUserCreateInput } from '@artifacts/type-graphql';
import { Context } from '@graphql-api/createContext';

@Resolver()
export class RegisterSimpleUserResolver {
  @Mutation(() => SimpleUser)
  async registerSimpleUser(
    @Arg('data') data: SimpleUserCreateInput,
    @Ctx() { prisma }: Context,
  ): Promise<SimpleUser> {
    const foundSimpleUser = await prisma.simpleUser.findUnique({
      where: { identifier: data.identifier },
    });

    if (foundSimpleUser !== null) return foundSimpleUser;

    return prisma.simpleUser.create({ data });
  }
}
