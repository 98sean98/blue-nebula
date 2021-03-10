import { shield } from 'graphql-shield';
import { isAuthenticated } from './rules';

export const permissions = shield({
  Query: {},
  Mutation: {
    createUser: isAuthenticated,
    updateUser: isAuthenticated,
    deleteUser: isAuthenticated,
    createAppData: isAuthenticated,
    updateAppData: isAuthenticated,
    deleteAppData: isAuthenticated,
  },
});
