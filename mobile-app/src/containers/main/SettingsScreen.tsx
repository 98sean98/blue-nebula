import React, { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, Toggle } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import { SettingsScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { releaseTag } from '@config/environment';

import { RootState } from '@reduxApp';
import { setSettings } from '@reduxApp/settings/actions';
import { setApplicationAlert } from '@reduxApp/application/actions';

import { RenderBleComponent } from '@components/shared/bluetooth';
import { UserAuth, LanguageSelector } from '@components/settings';
import { MicroAppDownload } from '@components/micro-app';

import { useBleRpiDeviceCharacteristic } from '@utilities/hooks';
import { checkIfIpAddress } from '@utilities/functions/checkIfIpAddress';

const styles = StyleSheet.create({
  text: { maxWidth: '75%' },
});

export const SettingsScreen: FC<SettingsScreenProps> = () => {
  const insets = useSafeAreaInsets();

  const { t } = useTranslation('settings');

  const dispatch = useDispatch();

  const settings = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    const writeStorage = async () => {
      const settingsJson = JSON.stringify(settings);
      await AsyncStorage.setItem('settings', settingsJson);
    };
    try {
      writeStorage().then();
      console.log('successfully wrote settings data into storage!');
    } catch (error) {
      console.log(error);
      dispatch(
        setApplicationAlert({
          title: 'Write Storage Error',
          message:
            'There was an error writing app settings data into your phone storage.',
        }),
      );
    }
  }, [dispatch, settings]);

  const { shouldMonitorDeviceConnection } = settings;

  const { isScanningAndConnecting } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  const { read: readIpAddress } = useBleRpiDeviceCharacteristic(
    'ipAddress',
    'string',
  );
  const [ipAddress, setIpAddress] = useState<string>();

  const onIpAddressRead = async () => {
    try {
      const newIpAddress = (await readIpAddress()) as string;
      if (newIpAddress === 'error')
        throw new Error(
          'internal logic error in device while trying to read the ip address',
        );
      else if (!checkIfIpAddress(newIpAddress)) {
        throw new Error(
          `the ip address received is not valid: ${newIpAddress}`,
        );
      }
      setIpAddress(newIpAddress);
    } catch (e) {
      console.log(e);
      dispatch(
        setApplicationAlert({
          title: 'Read Ip Address Error',
          message: `There was an error trying to read the device's ip address.`,
        }),
      );
    }
  };

  const { focusedMicroAppHeaders } = useSelector(
    (state: RootState) => state.application,
  );

  return (
    <View style={{ flex: 1, marginBottom: insets.bottom + 8 }}>
      <ScrollView style={[{ flex: 1 }, tailwind('mt-5 px-4')]}>
        {/* monitor device bluetooth connection */}
        <View style={tailwind('w-full flex-row justify-between items-center')}>
          <Text style={styles.text}>
            {t('monitor bluetooth connection') as string}
          </Text>
          <Toggle
            disabled={isScanningAndConnecting}
            checked={shouldMonitorDeviceConnection}
            onChange={() =>
              dispatch(
                setSettings({
                  shouldMonitorDeviceConnection: !shouldMonitorDeviceConnection,
                }),
              )
            }
          />
        </View>

        {/* language selector */}
        <LanguageSelector style={tailwind('mt-4')} />

        {/* read ip address */}
        <RenderBleComponent shouldShowHelperText={false}>
          <View
            style={tailwind(
              'mt-4 w-full flex-row justify-between items-center',
            )}>
            <Text style={styles.text}>
              {`Device ip address: `}
              <Text style={tailwind('font-bold')}>{ipAddress ?? ''}</Text>
            </Text>
            <Button appearance={'ghost'} onPress={onIpAddressRead}>
              Read
            </Button>
          </View>
        </RenderBleComponent>
      </ScrollView>

      <View style={tailwind('mt-4 px-4')}>
        {/* user authentication */}
        <UserAuth />

        {/* micro app manual download */}
        <MicroAppDownload style={tailwind('mt-2')} />

        {/* micro app info, and mobile app version */}
        <View style={tailwind('mt-2 items-center')}>
          {typeof focusedMicroAppHeaders !== 'undefined' ? (
            <Text>{`${focusedMicroAppHeaders.name} (version ${focusedMicroAppHeaders.activeVersion})`}</Text>
          ) : null}
          <Text>{`mobile app (version ${releaseTag})`}</Text>
        </View>
      </View>
    </View>
  );
};
