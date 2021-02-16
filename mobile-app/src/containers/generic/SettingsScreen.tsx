import React, { FC } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Toggle } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { SettingsScreenProps } from '@navigation/navigationTypes';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';
import { setSettings } from '@reduxApp/settings/actions';

export const SettingsScreen: FC<SettingsScreenProps> = () => {
  const dispatch = useDispatch();

  const { isScanningAndConnecting } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  const { shouldMonitorDeviceConnection } = useSelector(
    (state: RootState) => state.settings,
  );

  return (
    <ScrollView style={[{ flex: 1 }, tailwind('py-5 px-4')]}>
      <View style={tailwind('w-full flex-row justify-between items-center')}>
        <Text style={{ maxWidth: '80%' }}>
          Monitor device bluetooth connection when possible
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

      {/* todo: build app language selector after implementing i18n */}
    </ScrollView>
  );
};
