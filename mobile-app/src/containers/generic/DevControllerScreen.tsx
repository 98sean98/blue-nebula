import React, { FC, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Tab, TabView } from '@ui-kitten/components';

import { DevControllerScreenProps } from '@navigation/navigationTypes';

import { tailwind } from '@styles/tailwind';

import { TestingMode, RealTimeControlMode } from '@components/controller/dev';
import {
  BleReadDeviceButton,
  BleRunIdleButton,
  RenderBleComponent,
} from '@components/shared/bluetooth';

export const DevControllerScreen: FC<DevControllerScreenProps> = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <RenderBleComponent>
      <View style={[{ flex: 1 }]}>
        <TabView
          style={[{ flex: 1 }, tailwind('pt-2')]}
          tabBarStyle={tailwind('p-2')}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}>
          <Tab title={'Testing'}>
            <ScrollView style={tailwind('p-4')}>
              <TestingMode />
            </ScrollView>
          </Tab>
          <Tab title={'Real Time Control'}>
            <ScrollView style={tailwind('p-4')}>
              <RealTimeControlMode />
            </ScrollView>
          </Tab>
        </TabView>

        <View style={tailwind('m-4 flex-row justify-between')}>
          <BleReadDeviceButton style={{ width: '49%' }} />
          <BleRunIdleButton style={{ width: '49%' }} showVerbose />
        </View>
      </View>
    </RenderBleComponent>
  );
};
