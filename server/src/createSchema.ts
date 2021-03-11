import { buildSchema, NonEmptyArray } from 'type-graphql';
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

const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
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
];

export const createSchema = async () =>
  await buildSchema({
    resolvers,
    validate: false,
  });
