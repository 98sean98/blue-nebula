import React, { FC, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, View, ViewProps } from 'react-native';
import { Button, Divider, ListItem, Modal } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { SetupsReplacementScreenProps } from '@navigation/builder';

import { tailwind } from '@styles/tailwind';

import { Setup, Setups } from '@models/setup';

import { RootState } from '@reduxApp';
import { setSetups } from '@reduxApp/builder/actions';

import { SetupDetailsCard } from '@components/setups';
import { ConfirmationModal } from '@components/shared/actionable';
import { renderIcon } from '@components/shared/interface';

import { getBackdropStyle } from '@utilities/functions/ui';

type Data = { key: keyof Setups; setup: Setup };

export const SetupsReplacementScreen: FC<SetupsReplacementScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();

  const { setups } = useSelector((state: RootState) => state.builder);
  const { controlEntities } = useSelector((state: RootState) => state.control);

  const data: Array<Data> = useMemo(
    () => Object.entries(setups).map(([key, setup]) => ({ key, setup })),
    [setups],
  );

  const [selectedSetupKey, setSelectedSetupKey] = useState<keyof Setups>();
  const [showSetupDetailsModal, setShowSetupDetailsModal] = useState<boolean>(
    false,
  );
  const [
    showReplaceConfirmationModal,
    setShowReplaceConfirmationModal,
  ] = useState<boolean>(false);

  const onSaveNewSetupPress = () =>
    navigation.push('Builder', { screen: 'SetupForm' });

  const replaceSetup = () => {
    if (typeof selectedSetupKey !== 'undefined')
      dispatch(
        setSetups({
          [selectedSetupKey]: {
            ...setups[selectedSetupKey],
            updatedAt: new Date(),
            controlEntitiesState: controlEntities,
          },
        }),
      );
  };

  const onListItemPress = (key: keyof Setups) => {
    setShowSetupDetailsModal(!showSetupDetailsModal);
    setSelectedSetupKey(key);
  };

  const onReplaceSetupPress = (setupKey: keyof Setups) => {
    setSelectedSetupKey(setupKey);
    setShowReplaceConfirmationModal(true);
  };

  const onReplaceConfirmationPress = () => {
    replaceSetup();
    setSelectedSetupKey(undefined);
    setShowReplaceConfirmationModal(false);
    navigation.goBack();
  };

  const renderAccessoryRight = (
    viewProps: ViewProps | undefined,
    setupKey: keyof Setups,
  ) => (
    <Button
      status={'info'}
      appearance={'ghost'}
      accessoryLeft={renderIcon('edit-2-outline')}
      style={tailwind('h-10 w-10 p-1')}
      onPress={() => onReplaceSetupPress(setupKey)}
      {...viewProps}
    />
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

  const onReplaceButtonPress = () => {
    replaceSetup();
    setSelectedSetupKey(undefined);
    setShowSetupDetailsModal(false);
    navigation.goBack();
  };

  const renderReplaceButton = () => (
    <Button
      status={'info'}
      accessoryRight={renderIcon('edit-2-outline')}
      onPress={onReplaceButtonPress}>
      Replace this setup with the new control entities state
    </Button>
  );

  const ListFooterComponent = <View style={tailwind('h-16')} />;

  return (
    <>
      <View style={[{ flex: 1 }, tailwind('relative')]}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={Divider}
          ListFooterComponent={ListFooterComponent}
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
            style={{ flex: 1 }}
            renderButton={renderReplaceButton}
          />
        ) : null}
      </Modal>

      <ConfirmationModal
        visible={showReplaceConfirmationModal}
        onBackdropPress={() => setShowReplaceConfirmationModal(false)}
        action={'replace'}
        itemName={itemName}
        onYesPress={onReplaceConfirmationPress}
      />
    </>
  );
};
