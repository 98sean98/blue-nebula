import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from '@assets/locales/en';
import { zh } from '@assets/locales/zh-hk';

export const resources = {
  en,
  zh,
} as const;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    ns: ['bluetooth', 'common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })
  .then();

export default i18n;
