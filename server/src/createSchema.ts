import { buildSchema } from 'type-graphql';
import { UserCrudResolver } from '@generated/type-graphql';

console.log({ UserCrudResolver });

export const createSchema = async () =>
  await buildSchema({
    resolvers: [UserCrudResolver],
    validate: false,
  });
