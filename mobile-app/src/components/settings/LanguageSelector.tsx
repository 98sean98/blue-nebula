import React, { FC, useMemo } from 'react';
import {
  IndexPath,
  Select,
  SelectItem,
  SelectProps,
} from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sentenceCase } from 'change-case';

import { Language } from '@config/localisation/Language';

import { RootState } from '@reduxApp';
import { setSettings } from '@reduxApp/settings/actions';
import { useCasingForENTranslation } from '@utilities/hooks';

interface LanguageSelectorProps extends SelectProps {}

const languages = Object.entries(Language);

export const LanguageSelector: FC<LanguageSelectorProps> = ({ ...props }) => {
  const { t } = useTranslation('settings');

  const dispatch = useDispatch();

  const { language } = useSelector((state: RootState) => state.settings);

  const selectedIndex = useMemo(() => {
    const foundIndex =
      typeof language !== 'undefined'
        ? languages.findIndex(([_, value]) => value === language)
        : languages.length;
    return new IndexPath(foundIndex);
  }, [language]);

  const setSelectedIndex = (newIndex: IndexPath) => {
    const newLanguage =
      newIndex.row < languages.length ? languages[newIndex.row][1] : undefined;
    dispatch(setSettings({ language: newLanguage }));
  };

  const useDeviceLanguageText = useCasingForENTranslation(
    t('language.use device language'),
    sentenceCase,
  );

  const value = useMemo(
    () =>
      selectedIndex.row < languages.length
        ? sentenceCase(languages[selectedIndex.row][0])
        : useDeviceLanguageText,
    [selectedIndex, useDeviceLanguageText],
  );

  const languagesSelection = useMemo(
    () =>
      languages
        .map(([key]) => sentenceCase(key))
        .concat([useDeviceLanguageText]),
    [useDeviceLanguageText],
  );

  return (
    <Select
      label={useCasingForENTranslation(t('language.language'), sentenceCase)}
      value={value}
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index as IndexPath)}
      {...props}>
      {languagesSelection.map((selectionTitle, index) => (
        <SelectItem key={index} title={selectionTitle} />
      ))}
    </Select>
  );
};
