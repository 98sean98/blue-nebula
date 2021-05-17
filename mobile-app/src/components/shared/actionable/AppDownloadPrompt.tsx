import React, { FC, useCallback, useMemo } from 'react';
import { Linking, View, ViewProps } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { useTranslation } from 'react-i18next';

import { tailwind } from '@styles/tailwind';

import { appDownloadLink } from '@config/environment';

import { setApplicationAlert } from '@reduxApp/application/actions';

import { renderIcon } from '@components/shared/interface';

interface AppDownloadPromptProps extends ViewProps {}

export const AppDownloadPrompt: FC<AppDownloadPromptProps> = ({ ...props }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [data, setString] = useClipboard();

  const hasCopied = useMemo(() => data === appDownloadLink, [data]);

  const onCopyClipboardButtonPress = () => setString(appDownloadLink);

  const onLinkButtonPress = useCallback(() => {
    const url = appDownloadLink;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url).then();
      } else {
        console.log('unable to open app download url');
        dispatch(
          setApplicationAlert({
            title: 'Download Link Error',
            message:
              'There was an error opening the app download link on your device. Please close the app, and scan the QR code if found.',
          }),
        );
      }
    });
  }, [dispatch]);

  return (
    <View {...props} style={[tailwind('items-center'), props?.style ?? {}]}>
      <Text style={tailwind('text-center')}>
        {t('application update.download latest version') as string}
      </Text>
      <Layout style={tailwind('mt-4 rounded p-4 flex-row')} level={'4'}>
        <Text style={tailwind('font-bold')}>{appDownloadLink}</Text>
        <Button
          appearance={'ghost'}
          status={hasCopied ? 'info' : 'basic'}
          accessoryLeft={renderIcon('clipboard-outline')}
          style={tailwind('ml-2')}
          onPress={onCopyClipboardButtonPress}
        />
      </Layout>
      <Button
        accessoryRight={renderIcon('arrowhead-right-outline')}
        style={tailwind('w-40 mt-6')}
        onPress={onLinkButtonPress}>
        {t('application update.go to link') as string}
      </Button>
    </View>
  );
};
