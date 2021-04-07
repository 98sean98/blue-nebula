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
  // todo: remove create micro app data resolver, and aggregate micro app data resolver
  CreateMicroAppDataResolver,
  AggregateMicroAppDataResolver,
} from '@artifacts/type-graphql';

import { MeUserResolver } from '@graphql-api/user';
import {
  MicroAppWithActiveDataResolver,
  UpdateMicroAppDataResolver,
} from '@graphql-api/micro-app';

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
  AggregateMicroAppDataResolver,
] as const;

const customResolvers = [
  MeUserResolver,
  MicroAppWithActiveDataResolver,
  UpdateMicroAppDataResolver,
] as const;

export const createSchema = async () =>
  await buildSchema({
    resolvers: [...selectedResolvers, ...customResolvers],
    validate: false,
  });
