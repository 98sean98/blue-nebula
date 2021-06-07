const main = 'https://eisc.towngas.com/blue-nebula';

export const serverUrl = {
  main,
  auth: `${main}/auth`,
  graphql: `${main}/graphql`,
};

// manually update the release tag in conjunction with the tag on the latest release on github repo
export const releaseTag = 'v1.0.1';
export const githubTagsUrl =
  'https://api.github.com/repos/98sean98/blue-nebula/tags';

export const appDownloadLink = 'https://eisc.towngas.com/APK/src.apk';
