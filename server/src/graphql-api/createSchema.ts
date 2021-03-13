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
} from '@artifacts/type-graphql';

import { MeUserResolver } from '@graphql-api/user';

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
] as const;

const customResolvers = [MeUserResolver] as const;

export const createSchema = async () =>
  await buildSchema({
    // @ts-ignore
    resolvers: [...selectedResolvers, ...customResolvers],
    validate: false,
  });
