import { shield } from 'graphql-shield';
import { isAuthenticated } from './rules';

export const permissions = shield({
  Query: {
    me: isAuthenticated,
  },
  Mutation: {
    createUser: isAuthenticated,
    updateUser: isAuthenticated,
    deleteUser: isAuthenticated,
    createMicroApp: isAuthenticated,
    updateMicroApp: isAuthenticated,
    deleteMicroApp: isAuthenticated,
    createMicroAppData: isAuthenticated,
  },
});
