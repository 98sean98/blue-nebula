import React, { FC, useMemo } from 'react';
import {
  IndexPath,
  Select,
  SelectItem,
  SelectProps,
} from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { sentenceCase } from 'change-case';

import { Language } from '@config/localisation/Language';

import { RootState } from '@reduxApp';
import { setSettings } from '@reduxApp/settings/actions';

interface LanguageSelectorProps extends SelectProps {}

const languages = Object.entries(Language);

export const LanguageSelector: FC<LanguageSelectorProps> = ({ ...props }) => {
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

  const useDeviceLanguageText = 'Use device language';

  const value = useMemo(() => {
    const selectedLanguageKey =
      selectedIndex.row < languages.length
        ? languages[selectedIndex.row][0]
        : useDeviceLanguageText;
    return sentenceCase(selectedLanguageKey);
  }, [selectedIndex, useDeviceLanguageText]);

  const languagesSelection = useMemo(
    () => languages.map(([key]) => key).concat([useDeviceLanguageText]),
    [useDeviceLanguageText],
  );

  return (
    <Select
      label={'Language'}
      value={value}
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index as IndexPath)}
      {...props}>
      {languagesSelection.map((selectionTitle, index) => (
        <SelectItem key={index} title={sentenceCase(selectionTitle)} />
      ))}
    </Select>
  );
};
