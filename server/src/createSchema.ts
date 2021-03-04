import { buildSchema } from 'type-graphql';
import { resolvers } from '@generated/type-graphql';

export const createSchema = async () =>
  await buildSchema({
    resolvers,
    validate: false,
  });
