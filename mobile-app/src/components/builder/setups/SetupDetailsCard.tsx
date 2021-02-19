import React, { FC } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, CardProps, Divider, Text } from '@ui-kitten/components';
import moment from 'moment';

import { tailwind } from '@styles/tailwind';

import { Setup } from '@models/setup';

import { ControlEntitySummary } from '@components/shared/interface';

import { parseFromTypeToString } from '@utilities/functions/parse';

interface SetupDetailsCardProps extends CardProps {
  setup: Setup;
}

export const SetupDetailsCard: FC<SetupDetailsCardProps> = ({
  setup: {
    name,
    description,
    createdAt,
    updatedAt,
    fields,
    controlEntitiesState,
  },
  ...props
}) => {
  return (
    <Card disabled {...props}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tailwind('h-full')}>
        {/* main pieces of information */}
        <View style={tailwind('w-4/5')}>
          <Text category={'h5'}>{name}</Text>
          {description ? (
            <Text category={'label'} appearance={'hint'}>
              {description}
            </Text>
          ) : null}
          <Text category={'p2'} style={tailwind('mt-1')}>{`Created ${moment(
            createdAt,
          ).fromNow()}`}</Text>
          <Text category={'p2'}>{`Last updated ${moment(
            updatedAt,
          ).fromNow()}`}</Text>
        </View>

        <Divider style={tailwind('mt-2')} />

        {/* fields */}
        <View
          style={
            Object.entries(fields).length !== 0 ? tailwind('mt-2') : undefined
          }>
          {Object.entries(fields).map(([key, value]) => (
            <View
              key={key}
              style={tailwind('flex-row flex-wrap justify-between')}>
              <Text appearance={'hint'}>{`${key}:`}</Text>
              <Text>{parseFromTypeToString(value)}</Text>
            </View>
          ))}
        </View>
        {/* control entity state */}
        <ControlEntitySummary
          controlEntities={controlEntitiesState}
          style={tailwind('mt-2')}
        />
      </ScrollView>
    </Card>
  );
};
