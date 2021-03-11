import React, { FC, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, View } from 'react-native';
import { Button, Text, useTheme } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import semver from 'semver';

import { tailwind } from '@styles/tailwind';

import { appDownloadLink, releaseTag } from '@config/environment';

import { RootState } from '@reduxApp';
import { setApplicationError } from '@reduxApp/application/actions';

import { renderIcon } from '@components/shared/interface';

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

  const onLinkButtonPress = useCallback(() => {
    const url = appDownloadLink;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url).then();
      } else {
        console.log('unable to open app download url');
        Alert.alert(
          'Download Link Error',
          'There was an error opening the app download link on your device. Please close the app, and scan the QR code if found.',
        );
      }
    });
  }, []);

  return (
    <>
      {children}
      {requiresApplicationUpdate ? (
        <View
          style={[
            tailwind('absolute inset-0 justify-center items-center p-4'),
            { backgroundColor: theme['background-basic-color-2'] },
          ]}>
          <Text style={tailwind('text-center')}>
            Your application is outdated. Please download the app with the
            latest version by going to the following link.
          </Text>
          <Text style={tailwind('mt-2 text-center font-bold')}>
            {appDownloadLink}
          </Text>
          <Button
            accessoryRight={renderIcon('download-outline')}
            style={tailwind('w-3/5 mt-4')}
            onPress={onLinkButtonPress}>
            Go
          </Button>
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
