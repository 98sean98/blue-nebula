import React, { FC, useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { tailwind } from '@styles/tailwind';

import { GET_MICRO_APP } from '@api/graphql/microApp';

import { MicroApp } from '@models/application';

import { RootState } from '@reduxApp/rootReducer';

interface MicroAppDetailsProps extends ViewProps {}

export const MicroAppDetails: FC<MicroAppDetailsProps> = ({ ...props }) => {
  const { focusedMicroAppHeaders } = useSelector(
    (state: RootState) => state.application,
  );

  const { data: queryData } = useQuery(GET_MICRO_APP, {
    variables: { name: focusedMicroAppHeaders?.name ?? '' },
    fetchPolicy: 'cache-and-network',
  });

  const data = useMemo(() => {
    const typedQueryData = queryData as { microApp: MicroApp } | undefined;
    if (typeof typedQueryData !== 'undefined') return typedQueryData.microApp;
    return undefined;
  }, [queryData]);

  return typeof data !== 'undefined' ? (
    <View {...props}>
      <Text category={'c2'}>{`Active version: ${data.activeVersion}`}</Text>
      <Text category={'c2'} style={tailwind('mt-1')}>{`Created ${moment(
        data.createdAt,
      ).fromNow()}`}</Text>
      <Text category={'c2'} style={tailwind('mt-1')}>{`Last updated ${moment(
        data.updatedAt,
      ).fromNow()}`}</Text>
    </View>
  ) : (
    <></>
  );
};
