import { buildSchema } from 'type-graphql';
import {
  CreateUserResolver,
  FindManyUserResolver,
  FindUniqueUserResolver,
  UpdateUserResolver,
  DeleteUserResolver,
  CreateMicroAppResolver,
  FindManyMicroAppResolver,
  FindUniqueMicroAppResolver,
  UpdateMicroAppResolver,
  DeleteMicroAppResolver,
  FindManyMicroAppDataResolver,
  FindUniqueMicroAppDataResolver,
  CreateMicroAppDataResolver,
} from '@artifacts/type-graphql';

import { MeUserResolver } from '@graphql-api/user';
import { MicroAppWithActiveDataResolver } from '@graphql-api/micro-app';

const selectedResolvers = [
  CreateUserResolver,
  FindManyUserResolver,
  FindUniqueUserResolver,
  UpdateUserResolver,
  DeleteUserResolver,
  CreateMicroAppResolver,
  FindManyMicroAppResolver,
  FindUniqueMicroAppResolver,
  UpdateMicroAppResolver,
  DeleteMicroAppResolver,
  FindManyMicroAppDataResolver,
  FindUniqueMicroAppDataResolver,
  CreateMicroAppDataResolver,
] as const;

const customResolvers = [
  MeUserResolver,
  MicroAppWithActiveDataResolver,
] as const;

export const createSchema = async () =>
  await buildSchema({
    resolvers: [...selectedResolvers, ...customResolvers],
    validate: false,
  });
