import { Arg, Ctx, Query, Resolver } from 'type-graphql';

import { MicroAppWithActiveData } from './microAppWithActiveData.object';
import { MicroAppWhereUniqueInput } from '@artifacts/type-graphql';
import { Context } from '@graphql-api/createContext';

@Resolver()
export class MicroAppWithActiveDataResolver {
  @Query(() => MicroAppWithActiveData)
  async microAppWithActiveData(
    @Arg('where') where: MicroAppWhereUniqueInput,
    @Ctx() { prisma }: Context,
  ): Promise<MicroAppWithActiveData> {
    const microApp = await prisma.microApp.findUnique({
      where,
    });

    if (microApp === null) throw new Error('Micro app not found.');

    const data = await prisma.microAppData.findUnique({
      where: {
        microAppId_version: {
          microAppId: microApp.id,
          version: microApp.activeVersion,
        },
      },
    });

    if (data === null)
      throw new Error('Micro app data of the active version not found.');

    return { ...microApp, activeMicroAppData: data };
  }
}
