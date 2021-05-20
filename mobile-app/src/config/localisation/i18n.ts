import i18n, { ResourceLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { Language } from './Language';

import { en } from '@assets/locales/en';
import { zh } from '@assets/locales/zh-hk';

export const resources: Record<Language, ResourceLanguage> = {
  en,
  zh,
} as const;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    ns: [
      'auth',
      'bluetooth',
      'common',
      'control',
      'error',
      'microApp',
      'settings',
    ],
    defaultNS: 'common',
    fallbackNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })
  .then();

export default i18n;
