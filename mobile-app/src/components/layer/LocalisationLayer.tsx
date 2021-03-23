import React, { FC, useCallback, useEffect } from 'react';
import RNLocalize from 'react-native-localize';

import '@config/localisation/i18n';
import { useTranslation } from 'react-i18next';

export const LocalisationLayer: FC = ({ children }) => {
  const { t, i18n } = useTranslation();

  const handleLocalisationChange = useCallback(async () => {
    const bestLanguage = RNLocalize.findBestAvailableLanguage(['en', 'zh']);
    let i18nLanguage = 'en';
    if (typeof bestLanguage !== 'undefined')
      i18nLanguage = bestLanguage.languageTag;

    if (i18nLanguage !== i18n.language) await i18n.changeLanguage(i18nLanguage);
  }, [i18n]);

  useEffect(() => {
    handleLocalisationChange().then();
    RNLocalize.addEventListener('change', handleLocalisationChange);

    return () =>
      RNLocalize.removeEventListener('change', handleLocalisationChange);
  }, [handleLocalisationChange]);

  console.log('translated text:', t('simple controller'));

  return <>{children}</>;
};
