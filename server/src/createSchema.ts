import { buildSchema } from 'type-graphql';
import { UserCrudResolver } from '@artifacts/type-graphql';

export const createSchema = async () =>
  await buildSchema({
    resolvers: [UserCrudResolver],
    validate: false,
  });
