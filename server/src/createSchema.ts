import { buildSchema, NonEmptyArray } from 'type-graphql';
import {
  CreateUserResolver,
  FindManyUserResolver,
  FindUniqueUserResolver,
  UpdateUserResolver,
  DeleteUserResolver,
  CreateAppDataResolver,
  FindManyAppDataResolver,
  FindUniqueAppDataResolver,
  UpdateAppDataResolver,
  DeleteAppDataResolver,
} from '@artifacts/type-graphql';

const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  CreateUserResolver,
  FindManyUserResolver,
  FindUniqueUserResolver,
  UpdateUserResolver,
  DeleteUserResolver,
  CreateAppDataResolver,
  FindManyAppDataResolver,
  FindUniqueAppDataResolver,
  UpdateAppDataResolver,
  DeleteAppDataResolver,
];

export const createSchema = async () =>
  await buildSchema({
    resolvers,
    validate: false,
  });
