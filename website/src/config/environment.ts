const main = process.env.REACT_APP_SERVER_URL;

export const serverUrl = {
  main,
  auth: `${main}/auth`,
  graphql: `${main}/graphql`,
};
