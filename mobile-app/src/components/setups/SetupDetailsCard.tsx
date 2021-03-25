import React, { FC, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Layout, LayoutProps } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { Setup } from '@models/setup';

import { ControlEntitySummary } from '@components/shared/interface';

import { parseFromTypeToString } from '@utilities/functions/parse';
import { formatDate } from '@utilities/functions/formatDate';

interface SetupDetailsCardProps extends LayoutProps {
  setup: Setup;
  renderButton?: () => ReactNode;
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
  renderButton,
  ...props
}) => {
  const fieldsArray = Object.entries(fields);

  return (
    <Layout
      {...props}
      style={[
        tailwind('rounded overflow-hidden justify-between px-6 py-5'),
        props?.style ?? {},
      ]}>
      {/*main pieces of information*/}
      <View>
        <Text category={'h5'}>{name}</Text>
        {description ? (
          <Text category={'label'} appearance={'hint'}>
            {description}
          </Text>
        ) : null}
        <Text category={'c2'} style={tailwind('mt-1')}>{`Created: ${formatDate(
          createdAt,
        )}`}</Text>
        <Text category={'c2'}>{`Last updated: ${formatDate(updatedAt)}`}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tailwind('mt-2')}>
        {/* fields */}
        <View>
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

      {typeof renderButton !== 'undefined' ? (
        <View style={tailwind('mt-4')}>{renderButton()}</View>
      ) : null}
    </Layout>
  );
};
