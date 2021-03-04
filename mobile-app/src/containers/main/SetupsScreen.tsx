import React, { FC, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, View, ViewProps } from 'react-native';
import { Button, Divider, ListItem, Modal } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { SetupsScreenProps } from '@navigation/main';

import { tailwind } from '@styles/tailwind';

import { Setup, Setups } from '@models/setup';

import { RootState } from '@reduxApp';
import { removeSetup, setMakerConfig } from '@reduxApp/builder/actions';
import {
  clearAllControlEntity,
  setControlEntities,
} from '@reduxApp/control/actions';

import { SetupDetailsCard } from '@components/setups';
import { renderIcon } from '@components/shared/interface';
import { ConfirmationModal } from '@components/shared/actionable';

import { replaceSetupKeyInActionTree } from '@utilities/functions/app-maker';
import { getBackdropStyle } from '@utilities/functions/ui';

type Data = { key: keyof Setups; setup: Setup };

export const SetupsScreen: FC<SetupsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();

  const { setups, makerConfig } = useSelector(
    (state: RootState) => state.builder,
  );

  const data: Array<Data> = useMemo(
    () => Object.entries(setups).map(([key, setup]) => ({ key, setup })),
    [setups],
  );

  const [selectedSetupKey, setSelectedSetupKey] = useState<keyof Setups>();
  const [showSetupDetailsModal, setShowSetupDetailsModal] = useState<boolean>(
    false,
  );
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState<boolean>(false);

  const onSaveNewSetupPress = () =>
    navigation.push('Builder', { screen: 'SetupForm', params: {} });

  const onListItemPress = (key: keyof Setups) => {
    setShowSetupDetailsModal(!showSetupDetailsModal);
    setSelectedSetupKey(key);
  };

  const onEditSetupPress = (setupKey: keyof Setups) => {
    setSelectedSetupKey(undefined);
    setShowSetupDetailsModal(false);
    navigation.navigate('Builder', {
      screen: 'SetupForm',
      params: { keyOfSetupToBeEdited: setupKey },
    });
  };

  const onRemoveSetupPress = (setupKey: keyof Setups) => {
    setSelectedSetupKey(setupKey);
    setShowDeleteConfirmationModal(true);
  };

  const onDeleteConfirmationPress = () => {
    if (typeof selectedSetupKey !== 'undefined') {
      dispatch(removeSetup(selectedSetupKey));
      replaceSetupKeyInActionTree(
        makerConfig.actions,
        selectedSetupKey,
        undefined,
      );
      dispatch(setMakerConfig({ actions: makerConfig.actions }));
      setSelectedSetupKey(undefined);
      setShowDeleteConfirmationModal(false);
    }
  };

  const renderAccessoryRight = (
    viewProps: ViewProps | undefined,
    setupKey: keyof Setups,
  ) => (
    <View {...viewProps} style={[tailwind('flex-row')]}>
      <Button
        accessoryLeft={renderIcon('edit-outline')}
        appearance={'ghost'}
        status={'warning'}
        style={tailwind('h-10 w-10 p-1')}
        onPress={() => onEditSetupPress(setupKey)}
      />
      <Button
        accessoryLeft={renderIcon('trash-outline')}
        appearance={'ghost'}
        status={'danger'}
        style={tailwind('h-10 w-10 p-1')}
        onPress={() => onRemoveSetupPress(setupKey)}
      />
    </View>
  );

  const renderItem: ListRenderItem<Data> = ({
    item: {
      key,
      setup: { name, description },
    },
  }) => (
    <ListItem
      title={name}
      description={description}
      onPress={() => onListItemPress(key)}
      accessoryRight={(viewProps) => renderAccessoryRight(viewProps, key)}
    />
  );

  const keyExtractor = (item: Data) => item.key;

  const itemName = useMemo(
    () =>
      typeof selectedSetupKey !== 'undefined'
        ? setups[selectedSetupKey].name
        : '',
    [setups, selectedSetupKey],
  );

  const onLoadSetupPress = () => {
    if (typeof selectedSetupKey !== 'undefined') {
      dispatch(clearAllControlEntity());
      dispatch(
        setControlEntities(setups[selectedSetupKey].controlEntitiesState),
      );
      setShowSetupDetailsModal(false);
      navigation.navigate('Main', { screen: 'DevController' });
    }
  };

  const renderLoadButton = () => (
    <Button
      status={'info'}
      accessoryRight={renderIcon('arrowhead-right-outline')}
      onPress={onLoadSetupPress}>
      Load into the controller
    </Button>
  );

  return (
    <>
      <View style={[{ flex: 1 }, tailwind('relative')]}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={Divider}
        />

        {/* save new setup */}
        <Button
          style={[
            tailwind('absolute w-12 h-12 rounded-full'),
            { bottom: 15, right: 12 },
          ]}
          accessoryLeft={renderIcon('plus')}
          onPress={onSaveNewSetupPress}
        />
      </View>

      <Modal
        visible={showSetupDetailsModal}
        backdropStyle={getBackdropStyle()}
        onBackdropPress={() => setShowSetupDetailsModal(false)}
        style={[tailwind('w-4/5'), { height: '80%' }]}>
        {typeof selectedSetupKey !== 'undefined' ? (
          <SetupDetailsCard
            setup={setups[selectedSetupKey]}
            renderButton={renderLoadButton}
            style={{ flex: 1 }}
          />
        ) : null}
      </Modal>

      <ConfirmationModal
        visible={showDeleteConfirmationModal}
        onBackdropPress={() => setShowDeleteConfirmationModal(false)}
        action={'delete'}
        itemName={itemName}
        onYesPress={onDeleteConfirmationPress}
      />
    </>
  );
};
