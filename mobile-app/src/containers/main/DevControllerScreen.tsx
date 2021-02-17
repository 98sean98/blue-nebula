import React, { FC, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Tab, TabView } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { DevControllerScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

import { RealTimeControlMode, TestingMode } from '@components/controller/dev';
import { RenderBleComponent } from '@components/shared/bluetooth';

import { ControlEntities } from '@models/control-entity';

export type MotorCard = {
  entity: keyof ControlEntities;
  title: string;
};

export const DevControllerScreen: FC<DevControllerScreenProps> = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const { controlEntities } = useSelector((state: RootState) => state.control);

  const motors: Array<MotorCard> = useMemo(
    () =>
      Object.entries(controlEntities).map(([entity, { name }]) => ({
        entity,
        title: name,
      })),
    [controlEntities],
  );

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
