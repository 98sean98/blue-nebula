import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { Tab, TabView } from '@ui-kitten/components';

import { DevControllerScreenProps } from '@navigation/navigationTypes';

import { tailwind } from '@styles/tailwind';

import { RealTimeControlMode, TestingMode } from '@components/controller/dev';
import { RenderBleComponent } from '@components/shared/bluetooth';

import { DeclaredControlEntities } from '@config/declaredControlEntities';

export type MotorCard = {
  entity: keyof DeclaredControlEntities;
  title: string;
};

export const DevControllerScreen: FC<DevControllerScreenProps> = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const motors: Array<MotorCard> = [
    { entity: 'wheelMotor', title: 'Wheel' },
    { entity: 'screwMotor', title: 'Screw' },
  ];

  return (
    <RenderBleComponent>
      <View style={[{ flex: 1 }]}>
        <TabView
          style={[{ flex: 1 }, tailwind('pt-2')]}
          tabBarStyle={tailwind('p-2')}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}>
          <Tab title={'Testing'}>
            <TestingMode isFocused={selectedIndex === 0} motors={motors} />
          </Tab>
          <Tab title={'Real Time Control'}>
            <RealTimeControlMode
              isFocused={selectedIndex === 1}
              motors={motors}
            />
          </Tab>
        </TabView>
      </View>
    </RenderBleComponent>
  );
};
