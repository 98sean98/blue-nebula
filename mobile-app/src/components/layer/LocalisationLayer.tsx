import React, { FC, useCallback, useEffect } from 'react';
import RNLocalize from 'react-native-localize';
import { useTranslation } from 'react-i18next';

import '@config/localisation/i18n';

import { getDeviceLanguage } from '@utilities/functions/ux';

export const LocalisationLayer: FC = ({ children }) => {
  const { i18n } = useTranslation();

  const handleLocalisationChange = useCallback(async () => {
    const i18nLanguage = getDeviceLanguage();

    if (i18nLanguage !== i18n.language) await i18n.changeLanguage(i18nLanguage);
  }, [i18n]);

  useEffect(() => {
    handleLocalisationChange().then();
    RNLocalize.addEventListener('change', handleLocalisationChange);

    return () =>
      RNLocalize.removeEventListener('change', handleLocalisationChange);
  }, [handleLocalisationChange]);

  return <>{children}</>;
};
