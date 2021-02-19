import React, { FC, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, View, ViewProps } from 'react-native';
import { Button, Divider, ListItem, Modal } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { SetupsMode, SetupsScreenProps } from '@navigation/builder';

import { tailwind } from '@styles/tailwind';

import { Setups } from '@models/setup';

import { RootState } from '@reduxApp';
import { removeSetup } from '@reduxApp/builder/actions';

import { SetupDetailsCard } from '@components/builder/setups';
import { renderIcon } from '@components/shared/interface';
import { DeleteConfirmationModal } from '@components/shared/actionable';

export const SetupsScreen: FC<SetupsScreenProps> = ({ route, navigation }) => {
  const { mode } = route.params;

  const dispatch = useDispatch();

  const { setups } = useSelector((state: RootState) => state.builder);

  const data = useMemo(
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

  const renderItem: ListRenderItem<typeof data[0]> = ({
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

  const keyExtractor = (item: typeof data[0]) => item.key;

  return (
    <>
      <View style={[{ flex: 1 }, tailwind('relative')]}>
        <View style={[{ flex: 1 }, tailwind('my-5 px-4')]}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={Divider}
          />
        </View>

        {/* save new setup */}
        {mode === SetupsMode.SavingNew ? (
          <Button
            style={[
              tailwind('absolute w-12 h-12 rounded-full'),
              { bottom: 15, right: 12 },
            ]}
            accessoryLeft={renderIcon('plus')}
            onPress={onSaveNewSetupPress}
          />
        ) : null}
      </View>

      <Modal
        visible={showSetupDetailsModal}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setShowSetupDetailsModal(false)}
        style={[tailwind('w-4/5'), { height: '80%' }]}>
        {typeof selectedSetupKey !== 'undefined' ? (
          <SetupDetailsCard
            setup={setups[selectedSetupKey]}
            style={{ flex: 1 }}
          />
        ) : null}
      </Modal>

      <DeleteConfirmationModal
        visible={showDeleteConfirmationModal}
        onBackdropPress={() => setShowDeleteConfirmationModal(false)}
        itemName={
          typeof selectedSetupKey !== 'undefined'
            ? setups[selectedSetupKey].name
            : ''
        }
        onYesPress={onDeleteConfirmationPress}
      />
    </>
  );
};
