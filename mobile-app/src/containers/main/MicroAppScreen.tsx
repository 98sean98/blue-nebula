import React, { FC, useMemo, useState, useEffect } from 'react';
import { Alert, FlatList, ListRenderItem, View } from 'react-native';
import {
  Divider,
  Layout,
  ListItem,
  Modal,
  useTheme,
} from '@ui-kitten/components';
import { useApolloClient } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { IterableElement } from 'type-fest';
import moment from 'moment';

import { MicroAppScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { MicroAppData, MicroAppHeaders } from '@models/application';

import { RootState } from '@reduxApp';
import { setFocusedMicroAppHeaders } from '@reduxApp/application/actions';

import {
  GET_ALL_MICRO_APP_DATA,
  GET_MICRO_APP_HEADERS,
  UPDATE_MICRO_APP,
} from '@api/graphql/microApp';

import { MicroAppBackup } from '@components/micro-app';
import { MicroAppDataDetailsCard } from '@components/micro-app/MicroAppDataDetailsCard';

import { useApplicationQuery, useApplicationMutation } from '@utilities/hooks';
import { getBackdropStyle } from '@utilities/functions/ui';

export const MicroAppScreen: FC<MicroAppScreenProps> = () => {
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
      title: `${microAppName} Headers Query Error`,
      message: `There was an error fetching this micro app's headers from the server.`,
    },
  );
  const { data: queryData } = useApplicationQuery(
    [
      GET_ALL_MICRO_APP_DATA,
      {
        variables: microAppQueryVariables,
        fetchPolicy: 'cache-and-network',
      },
    ],
    {
      title: `${microAppName} Data Query Error`,
      message:
        'There was an error querying the list of data for this micro app.',
    },
  );
  const [updateMicroApp] = useApplicationMutation([UPDATE_MICRO_APP], {
    title: `Activate ${microAppName} Version Error`,
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

  const data: MicroAppData[] = useMemo(() => {
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

  const renderItem: ListRenderItem<IterableElement<typeof data>> = ({
    item: { id, name, version, createdAt },
  }) => (
    <ListItem
      title={`${version}. ${name ?? id}`}
      description={`Created ${moment(createdAt).fromNow()}`}
      onPress={() => onListItemPress(id)}
      style={
        version === focusedMicroAppHeaders?.activeVersion
          ? { backgroundColor: theme['color-info-transparent-hover'] }
          : undefined
      }
    />
  );

  const keyExtractor = (item: IterableElement<typeof data>) => item.id;

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
