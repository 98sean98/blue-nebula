import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { Tab, TabView } from '@ui-kitten/components';

import { DevControllerScreenProps } from '@navigation/navigationTypes';

import { tailwind } from '@styles/tailwind';

import { TestingMode, RealTimeControlMode } from '@components/controller/dev';
import { RenderBleComponent } from '@components/shared/bluetooth';

export const DevControllerScreen: FC<DevControllerScreenProps> = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <RenderBleComponent overrideShouldShow>
      <View style={[{ flex: 1 }]}>
        <TabView
          style={[{ flex: 1 }, tailwind('pt-2')]}
          tabBarStyle={tailwind('p-2')}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}>
          <Tab title={'Testing'}>
            <TestingMode />
          </Tab>
          <Tab title={'Real Time Control'}>
            <RealTimeControlMode />
          </Tab>
        </TabView>
      </View>
    </RenderBleComponent>
  );
};
