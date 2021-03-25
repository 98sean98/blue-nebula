import RNLocalize from 'react-native-localize';

import { Language } from '@config/localisation/Language';

export const getDeviceLanguage = (): Language => {
  const supportedLanguages = Object.values(Language);
  const bestLanguage = RNLocalize.findBestAvailableLanguage(supportedLanguages);
  let deviceLanguage: Language = Language.ENGLISH;
  if (typeof bestLanguage !== 'undefined')
    deviceLanguage = bestLanguage.languageTag;

  return deviceLanguage;
};
