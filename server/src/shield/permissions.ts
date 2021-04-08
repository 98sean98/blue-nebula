import { shield } from 'graphql-shield';
import { isAuthenticated } from './rules';

export const permissions = shield({
  Query: {
    me: isAuthenticated,
    simpleUsers: isAuthenticated,
    simpleUser: isAuthenticated,
    microAppDataUsageLog: isAuthenticated,
    microAppDataUsageLogs: isAuthenticated,
  },
  Mutation: {
    createUser: isAuthenticated,
    updateUser: isAuthenticated,
    deleteUser: isAuthenticated,
    createMicroApp: isAuthenticated,
    updateMicroApp: isAuthenticated,
    deleteMicroApp: isAuthenticated,
    updateMicroAppData: isAuthenticated,
  },
});
