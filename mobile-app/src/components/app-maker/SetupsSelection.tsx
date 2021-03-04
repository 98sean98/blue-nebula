import React, { FC, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, View, ViewProps } from 'react-native';
import { Button, Divider, ListItem, Modal } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { Setups } from '@models/setup';

import { RootState } from '@reduxApp';

import { SetupDetailsCard, SetupsListData } from '@components/setups';
import { renderIcon } from '@components/shared/interface';

import { getBackdropStyle } from '@utilities/functions/ui';
import { useAppMakerContext } from '@utilities/hooks';

interface SetupsSelection extends ViewProps {
  onSetupSelected: () => void;
}

export const SetupsSelection: FC<SetupsSelection> = ({
  onSetupSelected,
  ...props
}) => {
  const { setSetupIntoActionNode } = useAppMakerContext();

  const { setups } = useSelector((state: RootState) => state.builder);

  const data = useMemo(
    () => Object.entries(setups).map(([key, setup]) => ({ key, setup })),
    [setups],
  );

  const [selectedSetupKey, setSelectedSetupKey] = useState<keyof Setups>();
  const [showSetupDetailsModal, setShowSetupDetailsModal] = useState<boolean>(
    false,
  );

  const onSelectConfirmed = (setupKey: keyof Setups) => {
    onSetupSelected();
    setSetupIntoActionNode(setupKey);
  };

  const onListItemPress = (key: keyof Setups) => {
    setShowSetupDetailsModal(true);
    setSelectedSetupKey(key);
  };

  const renderAccessoryRight = (
    viewProps: ViewProps | undefined,
    setupKey: keyof Setups,
  ) => (
    <Button
      accessoryLeft={renderIcon('link-2-outline')}
      {...viewProps}
      onPress={() => onSelectConfirmed(setupKey)}
    />
  );

  const renderItem: ListRenderItem<SetupsListData> = ({
    item: {
      key,
      setup: { name, description },
    },
  }) => (
    <ListItem
      title={name}
      description={description}
      accessoryRight={(viewProps) => renderAccessoryRight(viewProps, key)}
      onPress={() => onListItemPress(key)}
    />
  );

  const keyExtractor = (item: SetupsListData) => item.key;

  const onSelectButtonPress = () => {
    setShowSetupDetailsModal(false);
    if (typeof selectedSetupKey !== 'undefined')
      onSelectConfirmed(selectedSetupKey);
  };

  const renderSelectButton = () => (
    <Button
      accessoryLeft={renderIcon('link-2-outline')}
      onPress={onSelectButtonPress}>
      Select
    </Button>
  );

  return (
    <>
      <View {...props}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={Divider}
          {...props}
        />
      </View>

      <Modal
        visible={showSetupDetailsModal}
        backdropStyle={getBackdropStyle()}
        onBackdropPress={() => setShowSetupDetailsModal(false)}
        style={tailwind('w-4/5 h-4/5')}>
        {typeof selectedSetupKey !== 'undefined' ? (
          <SetupDetailsCard
            setup={setups[selectedSetupKey]}
            style={{ flex: 1 }}
            renderButton={renderSelectButton}
          />
        ) : null}
      </Modal>
    </>
  );
};
