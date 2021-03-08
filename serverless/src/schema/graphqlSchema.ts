import { buildSchemaSync } from 'type-graphql';
import { UserCrudResolver } from '../artifacts/type-graphql';

export const graphqlSchema = buildSchemaSync({
  resolvers: [UserCrudResolver],
  validate: false,
});
