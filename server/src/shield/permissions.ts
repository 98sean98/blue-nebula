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
    // todo: remove create micro app data resolver
    createMicroAppData: isAuthenticated,
    updateMicroAppData: isAuthenticated,
  },
});
