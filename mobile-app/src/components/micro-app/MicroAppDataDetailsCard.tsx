import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { Button, Layout, LayoutProps, Text } from '@ui-kitten/components';
import { useQuery, ApolloClient } from '@apollo/client';

import { tailwind } from '@styles/tailwind';

import { MicroAppData } from '@models/application';
import { User } from '@models/auth';

import { GET_USER } from '@api/graphql/user';

import { renderIcon } from '@components/shared/interface';

import { formatDate } from '@utilities/functions/formatDate';

interface MicroAppDataDetailsCardProps extends LayoutProps {
  apolloClient: ApolloClient<unknown>;
  microAppData: MicroAppData;
  showActivateButton: boolean;
  onActivateButtonPress?: () => void;
}

export const MicroAppDataDetailsCard: FC<MicroAppDataDetailsCardProps> = ({
  apolloClient,
  microAppData: { id, name, version, createdAt, creatorId },
  showActivateButton,
  onActivateButtonPress,
  ...props
}) => {
  const { data: creatorData } = useQuery(GET_USER, {
    client: apolloClient,
    variables: { id: creatorId },
    fetchPolicy: 'cache-and-network',
  });
  const creator: User | undefined = useMemo(() => creatorData?.user, [
    creatorData,
  ]);

  return (
    <Layout
      {...props}
      style={[
        tailwind('rounded overflow-hidden px-6 py-5'),
        props?.style ?? {},
      ]}>
      <Text category={'h5'}>{name ?? id}</Text>
      <Text
        category={'label'}
        appearance={'hint'}>{`Version: ${version}`}</Text>
      <Text category={'c2'} style={tailwind('mt-1')}>{`Created: ${formatDate(
        createdAt,
      )}`}</Text>

      <View style={tailwind('mt-4')}>
        <Text category={'s1'}>Creator</Text>
        {typeof creator !== 'undefined' ? (
          <Text>{`${creator.firstName} ${creator.lastName} (${creator.username})`}</Text>
        ) : null}
      </View>

      {showActivateButton ? (
        <Button
          accessoryLeft={renderIcon('star-outline')}
          style={tailwind('mt-5')}
          onPress={onActivateButtonPress}>
          Activate this version
        </Button>
      ) : null}
    </Layout>
  );
};
