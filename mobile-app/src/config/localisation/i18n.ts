import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '@assets/locales/en.json';
import zhTranslation from '@assets/locales/zh-yue.json';

export const resources = {
  en: { translation: enTranslation },
  zh: { translation: zhTranslation },
} as const;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
  .then();

export default i18n;
