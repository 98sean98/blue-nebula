import { shield } from 'graphql-shield';
import { isAuthenticated } from './rules';

export const permissions = shield({
  Query: {},
  Mutation: {
    createUser: isAuthenticated,
    updateUser: isAuthenticated,
    deleteUser: isAuthenticated,
    createApp: isAuthenticated,
    updateApp: isAuthenticated,
    deleteApp: isAuthenticated,
  },
});
