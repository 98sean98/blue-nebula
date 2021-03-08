import { buildSchemaSync } from 'type-graphql';
import { UserCrudResolver } from '@generated/type-graphql';

export const graphqlSchema = buildSchemaSync({
  resolvers: [UserCrudResolver],
  validate: false,
});
