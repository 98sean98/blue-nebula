const main = 'https://scraper-staging.herokuapp.com';

export const serverUrl = {
  main,
  auth: `${main}/auth`,
  graphql: `${main}/graphql`,
};

// for now, manually update the release tag in conjunction with the tag on the latest release on github repo
// todo: abstract this to use an environment variable that is updated on ci/cd
export const releaseTag = 'v0.0.7';

export const appDownloadLink =
  'https://drive.google.com/drive/folders/1ZJXtwy7sIi97cVVAn4BY7bHpVlrG1_z7?usp=sharing';
