import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import semver from 'semver';
import { useTranslation } from 'react-i18next';

import { tailwind } from '@styles/tailwind';

import { githubTagsUrl, releaseTag } from '@config/environment';

import { ApplicationMode } from '@models/application';

import { RootState } from '@reduxApp';
import {
  setApplicationAlert,
  setShouldForceMicroAppUpdate,
} from '@reduxApp/application/actions';

import { AppDownloadPrompt } from '@components/shared/actionable';

import { getBackdropStyle } from '@utilities/functions/ui';

export const ApplicationLayer: FC = ({ children }) => {
  const theme = useTheme();

  const { t } = useTranslation('error');

  const dispatch = useDispatch();

  const { isLoading, applicationAlert, applicationMode } = useSelector(
    (state: RootState) => state.application,
  );

  useEffect(() => {
    if (typeof applicationAlert !== 'undefined') {
      if (
        !applicationAlert.isError ||
        applicationMode === ApplicationMode.GAME_MASTER
      ) {
        // alert is not an error, or application mode is game master
        const { title, message } = applicationAlert;
        Alert.alert(title, message);
      } else {
        // override the application error alert, and just show a simple generic error from locales
        const title = t('simple.title'),
          message = t('simple.message');
        Alert.alert(title, message);
      }

      dispatch(setApplicationAlert(undefined));
    }
  }, [dispatch, t, applicationAlert, applicationMode]);

  const [
    requiresApplicationUpdate,
    setRequiresApplicationUpdate,
  ] = useState<boolean>(false);

  useEffect(() => {
    const getLatestReleaseTag = async (): Promise<string> => {
      try {
        const url = githubTagsUrl;
        const response = await axios.get(url);

        if (typeof response.data === 'undefined')
          throw new Error('response data is undefined');

        const versions = (response.data as Array<{
          name: string;
        }>).sort((v1, v2) => semver.compare(v2.name, v1.name));
        return versions[0].name;
      } catch (error) {
        console.log('error retrieving the latest release tag:', error);
        return 'v0.0.1';
      }
    };

    getLatestReleaseTag().then((latestTag) => {
      // check if the current app version satisfies latest tag up to the same minor version
      const version = `v${semver.major(latestTag)}.${semver.minor(latestTag)}`;
      const newRequiresApplicationUpdate = !semver.satisfies(
        releaseTag,
        version,
      );
      setRequiresApplicationUpdate(newRequiresApplicationUpdate);
      // if the mobile app needs to be updated, set the micro apps force update state to true as well to ensure that it will also be updated
      if (newRequiresApplicationUpdate)
        dispatch(setShouldForceMicroAppUpdate(true));
    });
  }, [dispatch]);

  return (
    <>
      {children}
      {requiresApplicationUpdate ? (
        <View
          style={[
            tailwind('absolute inset-0 justify-center items-center'),
            { backgroundColor: theme['background-basic-color-2'] },
          ]}>
          <AppDownloadPrompt style={tailwind('mx-12')} />
        </View>
      ) : null}

      {isLoading ? (
        <View
          style={[
            tailwind('absolute inset-0 justify-center items-center'),
            { zIndex: 999 },
            getBackdropStyle(),
          ]}>
          <ActivityIndicator
            size="large"
            animating={true}
            color={theme['color-basic-300']}
          />
        </View>
      ) : null}
    </>
  );
};
