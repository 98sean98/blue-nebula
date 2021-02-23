import React, { ComponentProps, FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@reduxApp';
import { Setup, Setups } from '@models/setup';
import { Divider, ListItem, ListItemProps, Modal } from '@ui-kitten/components';
import { FlatList, FlatListProps, ListRenderItem } from 'react-native';

import { tailwind } from '@styles/tailwind';

import { SetupDetailsCard } from '@components/setups/index';

export type SetupsListData = {
  key: string;
  setup: Setup;
};

interface SimpleSetupsList extends Partial<FlatListProps<SetupsListData>> {
  listItemProps?: ListItemProps;
  setupDetailsCardProps?: Partial<ComponentProps<typeof SetupDetailsCard>>;
  onSelectedSetupKey?: (selectedSetupKey: keyof Setups) => void;
}

export const SimpleSetupsList: FC<SimpleSetupsList> = ({
  listItemProps,
  setupDetailsCardProps,
  onSelectedSetupKey,
  ...props
}) => {
  const { setups } = useSelector((state: RootState) => state.builder);

  const data = useMemo(
    () => Object.entries(setups).map(([key, setup]) => ({ key, setup })),
    [setups],
  );

  const [selectedSetupKey, setSelectedSetupKey] = useState<keyof Setups>();
  const [showSetupDetailsModal, setShowSetupDetailsModal] = useState<boolean>(
    false,
  );

  const onListItemPress = (key: keyof Setups) => {
    setShowSetupDetailsModal(!showSetupDetailsModal);
    setSelectedSetupKey(key);
    if (typeof onSelectedSetupKey !== 'undefined') onSelectedSetupKey(key);
  };

  const renderItem: ListRenderItem<SetupsListData> = ({
    item: {
      key,
      setup: { name, description },
    },
  }) => (
    <ListItem
      title={name}
      description={description}
      onPress={() => onListItemPress(key)}
      {...listItemProps}
    />
  );

  const keyExtractor = (item: SetupsListData) => item.key;

  return (
    <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Divider}
        {...props}
      />

      <Modal
        visible={showSetupDetailsModal}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setShowSetupDetailsModal(false)}
        style={tailwind('w-4/5 h-4/5')}>
        {typeof selectedSetupKey !== 'undefined' ? (
          <SetupDetailsCard
            setup={setups[selectedSetupKey]}
            style={{ flex: 1 }}
            {...setupDetailsCardProps}
          />
        ) : null}
      </Modal>
    </>
  );
};
