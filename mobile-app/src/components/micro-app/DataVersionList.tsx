import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, FlatListProps, ListRenderItem } from 'react-native';
import {
  Divider,
  ListItem,
  Modal,
  Text,
  useTheme,
} from '@ui-kitten/components';
import { useApolloClient } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { tailwind } from '@styles/tailwind';

import {
  setFocusedMicroAppHeaders,
  setShouldFetchMicroApp,
} from '@reduxApp/application/actions';
import { MicroAppData, MicroAppHeaders } from '@models/application';

import {
  GET_ALL_MICRO_APP_DATA,
  GET_MICRO_APP_HEADERS,
  UPDATE_MICRO_APP,
} from '@api/graphql/microApp';

import { RootState } from '@reduxApp';

import { MicroAppDataDetailsCard } from './MicroAppDataDetailsCard';

import { useApplicationMutation, useApplicationQuery } from '@utilities/hooks';
import { getBackdropStyle } from '@utilities/functions/ui';

type Data = MicroAppData;

interface DataVersionListProps
  extends Omit<FlatListProps<Data>, 'data' | 'renderItem'> {}

export const DataVersionList: FC<DataVersionListProps> = ({ ...props }) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const {
    application: { focusedMicroAppHeaders },
    auth: { user },
  } = useSelector((state: RootState) => state);

  const microAppName = useMemo(
    () => focusedMicroAppHeaders?.name ?? 'Micro App',
    [focusedMicroAppHeaders],
  );

  const microAppQueryVariables = useMemo(
    () => ({ name: focusedMicroAppHeaders?.name }),
    [focusedMicroAppHeaders],
  );

  const apolloClient = useApolloClient();
  const {
    data: microAppHeaders,
    refetch: refetchHeaders,
  } = useApplicationQuery(
    [
      GET_MICRO_APP_HEADERS,
      {
        variables: { name: focusedMicroAppHeaders?.name },
        fetchPolicy: 'network-only',
      },
    ],
    {
      errorConfig: {
        title: `${microAppName} Headers Query Error`,
        message: `There was an error fetching this micro app's headers from the server.`,
      },
    },
  );
  const {
    data: queryData,
    refetch: refetchData,
    loading: dataLoading,
    called: calledData,
  } = useApplicationQuery(
    [
      GET_ALL_MICRO_APP_DATA,
      {
        variables: microAppQueryVariables,
        fetchPolicy: 'cache-and-network',
      },
    ],
    {
      shouldSetIsLoading: false,
      errorConfig: {
        title: `${microAppName} Data Query Error`,
        message:
          'There was an error querying the list of data for this micro app.',
      },
    },
  );
  const [updateMicroApp] = useApplicationMutation([UPDATE_MICRO_APP], {
    errorConfig: {
      title: `Activate ${microAppName} Version Error`,
    },
  });

  // set focused micro app headers
  useEffect(() => {
    const typedMicroAppHeaders = microAppHeaders as
      | { microApp: MicroAppHeaders | null }
      | undefined;
    if (
      typeof typedMicroAppHeaders !== 'undefined' &&
      typedMicroAppHeaders.microApp !== null
    ) {
      const { id, name, activeVersion } = typedMicroAppHeaders.microApp;
      dispatch(setFocusedMicroAppHeaders({ id, name, activeVersion }));
    }
  }, [dispatch, microAppHeaders]);

  const data: Data[] = useMemo(() => {
    const typedQueryData = queryData as
      | { findManyMicroAppData: MicroAppData[] | null }
      | undefined;
    if (
      typeof typedQueryData !== 'undefined' &&
      typedQueryData.findManyMicroAppData !== null
    )
      return typedQueryData.findManyMicroAppData;
    return [];
  }, [queryData]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDataId, setSelectedDataId] = useState<string>();

  const onListItemPress = (id: string) => {
    setSelectedDataId(id);
    setShowModal(true);
  };

  const renderItem: ListRenderItem<Data> = ({
    item: { id, name, version, createdAt },
  }) => (
    <ListItem
      title={`${version}. ${name ?? id}`}
      description={`Created ${moment(createdAt).fromNow()}`}
      onPress={() => onListItemPress(id)}
      style={[
        tailwind('rounded'),
        version === focusedMicroAppHeaders?.activeVersion
          ? [
              { borderColor: theme['color-info-default-border'] },
              tailwind('border'),
            ]
          : {},
      ]}
    />
  );

  const keyExtractor = (item: Data) => item.id;

  const onRefresh = useCallback(() => {
    refetchData(microAppQueryVariables);
  }, [refetchData, microAppQueryVariables]);

  const ListHeaderComponent = useMemo(
    () => (
      <Text
        category={'s2'}
        appearance={'hint'}
        style={tailwind('text-center mb-2')}>
        Pull down to refresh
      </Text>
    ),
    [],
  );

  const refreshing = useMemo(() => calledData && dataLoading, [
    calledData,
    dataLoading,
  ]);

  const selectedData = useMemo(
    () => data.find(({ id }) => id === selectedDataId),
    [data, selectedDataId],
  );

  const onActivateButtonPress = async () => {
    try {
      if (
        typeof focusedMicroAppHeaders === 'undefined' ||
        typeof user === 'undefined' ||
        typeof selectedData === 'undefined'
      )
        return; // no-op

      const variables = {
        name: focusedMicroAppHeaders.name,
        activeVersion: selectedData.version,
        updaterUsername: user.username,
      };

      const response = await updateMicroApp({ variables });
      await refetchHeaders();

      dispatch(setShouldFetchMicroApp(true));

      if (typeof response.data !== 'undefined') {
        Alert.alert(
          `${microAppName} Version Activation Success`,
          `This micro app's version has been successfully activated to ${selectedData?.version}!`,
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Divider}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={ListHeaderComponent}
        {...props}
      />
      <Modal
        visible={showModal}
        onBackdropPress={() => setShowModal(false)}
        backdropStyle={getBackdropStyle()}
        style={[tailwind('w-4/5')]}>
        {typeof selectedData !== 'undefined' ? (
          <MicroAppDataDetailsCard
            apolloClient={apolloClient}
            microAppData={selectedData}
            showActivateButton={
              selectedData.version !== focusedMicroAppHeaders?.activeVersion
            }
            onActivateButtonPress={onActivateButtonPress}
            style={{ flex: 1 }}
          />
        ) : null}
      </Modal>
    </>
  );
};
