import { buildSchemaSync } from 'type-graphql';
import { UserCrudResolver } from '@artifacts/type-graphql';

(global as any).schema =
  (global as any).schema ||
  buildSchemaSync({
    resolvers: [UserCrudResolver],
    validate: false,
  });

export const graphqlSchema = (global as any).schema;
