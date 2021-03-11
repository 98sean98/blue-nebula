import { buildSchema, NonEmptyArray } from 'type-graphql';
import {
  CreateUserResolver,
  FindManyUserResolver,
  FindUniqueUserResolver,
  UpdateUserResolver,
  DeleteUserResolver,
  CreateAppResolver,
  FindManyAppResolver,
  FindUniqueAppResolver,
  UpdateAppResolver,
  DeleteAppResolver,
} from '@artifacts/type-graphql';

const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  CreateUserResolver,
  FindManyUserResolver,
  FindUniqueUserResolver,
  UpdateUserResolver,
  DeleteUserResolver,
  CreateAppResolver,
  FindManyAppResolver,
  FindUniqueAppResolver,
  UpdateAppResolver,
  DeleteAppResolver,
];

export const createSchema = async () =>
  await buildSchema({
    resolvers,
    validate: false,
  });
