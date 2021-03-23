import { useTranslation } from 'react-i18next';
import { Language } from '@config/localisation/Language';

export const useCasingForENTranslation = (
  text: string,
  casingFunction: (string: string) => string,
): string => {
  const { i18n } = useTranslation();

  if (i18n.language === Language.EN) return casingFunction(text);
  return text;
};
