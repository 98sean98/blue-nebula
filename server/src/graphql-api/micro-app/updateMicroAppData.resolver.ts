import { Prisma } from '@prisma/client';
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';

import { MicroAppWhereUniqueInput } from '@artifacts/type-graphql';
import { MicroAppWithActiveData } from './microAppWithActiveData.object';
import { Context } from '@graphql-api/createContext';
import { JSONResolver } from 'graphql-scalars';

@InputType()
class UpdateMicroAppDataInput {
  @Field({ nullable: true })
  dataName?: string;

  @Field(() => JSONResolver)
  data: Prisma.JsonValue;
}

@Resolver()
export class UpdateMicroAppDataResolver {
  @Mutation(() => MicroAppWithActiveData)
  async updateMicroAppData(
    @Arg('data') { dataName, data }: UpdateMicroAppDataInput,
    @Arg('where') where: MicroAppWhereUniqueInput,
    @Ctx()
    { prisma, auth: { user } }: Context,
  ): Promise<MicroAppWithActiveData> {
    if (typeof user === 'undefined')
      throw new Error('User is not authenticated. This is a no-op.');

    const updater = { connect: { username: user.username } };

    const foundMicroApp = await prisma.microApp.findUnique({ where });

    if (foundMicroApp === null) throw new Error('Micro App is not found.');

    // get the max version of data for this micro app
    const {
      max: { version },
    } = await prisma.microAppData.aggregate({
      where: { microApp: { is: { name: { equals: foundMicroApp.name } } } },
      max: { version: true },
    });

    const newVersion = (version ?? 0) + 1;

    // update the micro app, and create new data
    const updatedMicroApp = await prisma.microApp.update({
      data: {
        activeVersion: { set: newVersion },
        microAppDataList: {
          create: {
            name: dataName,
            version: newVersion,
            data,
            creator: updater,
          },
        },
        updater,
      },
      where,
    });

    const activeMicroAppData = await prisma.microAppData.findUnique({
      where: {
        microAppId_version: {
          microAppId: updatedMicroApp.id,
          version: updatedMicroApp.activeVersion,
        },
      },
    });

    if (activeMicroAppData === null)
      throw new Error('Micro app data of the active version not found.');

    return { ...updatedMicroApp, activeMicroAppData };
  }
}
