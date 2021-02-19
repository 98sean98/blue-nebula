import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { Tab, TabView } from '@ui-kitten/components';

import { DevControllerScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { RealTimeControlMode, TestingMode } from '@components/controller/dev';
import { RenderBleComponent } from '@components/shared/bluetooth';

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
            <TestingMode isFocused={selectedIndex === 0} />
          </Tab>
          <Tab title={'Real Time Control'}>
            <RealTimeControlMode isFocused={selectedIndex === 1} />
          </Tab>
        </TabView>
      </View>
    </RenderBleComponent>
  );
};
