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
  FindManySimpleUserResolver,
  FindUniqueSimpleUserResolver,
  FindManyMicroAppDataUsageLogResolver,
  FindUniqueMicroAppDataUsageLogResolver,
  CreateMicroAppDataUsageLogResolver,
} from '@artifacts/type-graphql';

import { MeUserResolver, RegisterSimpleUserResolver } from '@graphql-api/user';
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
  FindManySimpleUserResolver,
  FindUniqueSimpleUserResolver,
  FindManyMicroAppDataUsageLogResolver,
  FindUniqueMicroAppDataUsageLogResolver,
  CreateMicroAppDataUsageLogResolver,
] as const;

const customResolvers = [
  MeUserResolver,
  RegisterSimpleUserResolver,
  MicroAppWithActiveDataResolver,
  UpdateMicroAppDataResolver,
] as const;

export const createSchema = async () =>
  await buildSchema({
    resolvers: [...selectedResolvers, ...customResolvers],
    validate: false,
  });
