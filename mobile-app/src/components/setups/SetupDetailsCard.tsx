import React, { FC, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, CardProps, Text } from '@ui-kitten/components';
import moment from 'moment';

import { tailwind } from '@styles/tailwind';

import { Setup } from '@models/setup';

import { ControlEntitySummary } from '@components/shared/interface';

import { parseFromTypeToString } from '@utilities/functions/parse';

interface SetupDetailsCardProps extends CardProps {
  setup: Setup;
  renderLoadButton?: () => ReactNode;
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
  renderLoadButton,
  ...props
}) => {
  const fieldsArray = Object.entries(fields);

  const showLoadButton = typeof renderLoadButton !== 'undefined';

  return (
    <Card
      disabled
      {...props}
      style={[tailwind('justify-between'), props?.style ?? {}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: showLoadButton ? '85%' : '100%' }}>
        {/*main pieces of information*/}
        <View>
          <Text category={'h5'}>{name}</Text>
          {description ? (
            <Text category={'label'} appearance={'hint'}>
              {description}
            </Text>
          ) : null}
          <Text category={'c2'} style={tailwind('mt-1')}>{`Created ${moment(
            createdAt,
          ).fromNow()}`}</Text>
          <Text category={'c2'}>{`Last updated ${moment(
            updatedAt,
          ).fromNow()}`}</Text>
        </View>

        {/* fields */}
        <View style={tailwind('mt-2')}>
          {fieldsArray.map(([key, value]) => (
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
          style={fieldsArray.length !== 0 ? tailwind('mt-2') : undefined}
        />
      </ScrollView>

      {typeof renderLoadButton !== 'undefined' ? (
        <View style={tailwind('mt-4')}>{renderLoadButton()}</View>
      ) : null}
    </Card>
  );
};
