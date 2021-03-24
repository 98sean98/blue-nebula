import React, { FC, useEffect, useMemo } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Divider, Layout, ListItem } from '@ui-kitten/components';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { MicroAppScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { MicroAppData } from '@models/application';

import { RootState } from '@reduxApp';
import {
  setApplicationError,
  setIsLoading,
} from '@reduxApp/application/actions';

import { GET_ALL_MICRO_APP_DATA } from '@api/graphql/microApp';

import { MicroAppBackup } from '@components/micro-app';
import { IterableElement } from 'type-fest';

export const MicroAppScreen: FC<MicroAppScreenProps> = () => {
  const dispatch = useDispatch();

  const { focusedMicroAppHeaders } = useSelector(
    (state: RootState) => state.application,
  );

  const { data: queryData, loading, error } = useQuery(GET_ALL_MICRO_APP_DATA, {
    variables: { name: focusedMicroAppHeaders?.name },
    fetchPolicy: 'cache-and-network',
  });

  const itemName = useMemo(() => focusedMicroAppHeaders?.name ?? 'Micro App', [
    focusedMicroAppHeaders,
  ]);

  // loading effect
  useEffect(() => {
    dispatch(setIsLoading(loading));
  }, [dispatch, loading]);

  // error effect
  useEffect(() => {
    if (typeof error !== 'undefined')
      dispatch(
        setApplicationError({
          title: `${itemName} Data Query Error`,
          message:
            'There was an error querying the list of data for this micro app.',
        }),
      );
  }, [dispatch, error, itemName]);

  const data: MicroAppData[] = useMemo(() => {
    if (
      typeof queryData !== 'undefined' &&
      queryData.findManyMicroAppData !== null
    )
      return queryData.findManyMicroAppData;
    return [];
  }, [queryData]);

  const renderItem: ListRenderItem<IterableElement<typeof data>> = ({
    item: { id, name, version, createdAt },
  }) => (
    <ListItem
      title={`${version}. ${name ?? id}`}
      description={`Created ${moment(createdAt).fromNow()}`}
    />
  );

  const keyExtractor = (item: IterableElement<typeof data>) => item.id;

  return (
    <View style={[{ flex: 1 }, tailwind('my-5')]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Divider}
      />

      <Divider />

      <Layout style={tailwind('w-full py-1 px-4')} level={'2'}>
        <MicroAppBackup />
      </Layout>
    </View>
  );
};
