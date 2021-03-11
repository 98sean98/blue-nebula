import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import semver from 'semver';

import { tailwind } from '@styles/tailwind';

import { releaseTag } from '@config/environment';

import { RootState } from '@reduxApp';
import { setApplicationError } from '@reduxApp/application/actions';

import { AppDownloadPrompt } from '@components/shared/actionable';

import { getBackdropStyle } from '@utilities/functions/ui';

export const ApplicationLayer: FC = ({ children }) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { isLoading, applicationError } = useSelector(
    (state: RootState) => state.application,
  );

  useEffect(() => {
    if (typeof applicationError !== 'undefined') {
      const { title, message } = applicationError;
      Alert.alert(title, message);
      dispatch(setApplicationError(undefined));
    }
  }, [dispatch, applicationError]);

  const [requiresApplicationUpdate, setRequiresApplicationUpdate] = useState<
    boolean
  >(false);

  useEffect(() => {
    const getLatestReleaseTag = async (): Promise<string> => {
      try {
        const url = `https://api.github.com/repos/98sean98/blue-nebula/tags`;
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

    getLatestReleaseTag().then((tag) => {
      setRequiresApplicationUpdate(tag !== releaseTag);
    });
  }, []);

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
