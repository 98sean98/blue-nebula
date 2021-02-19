import React, { FC, useState } from 'react';
import { Card, CardProps, Text, Button } from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';
import { View, ViewProps } from 'react-native';

import { tailwind } from '@styles/tailwind';

import { renderIcon } from '@components/shared/interface/renderIcon';
import { DeleteConfirmationModal } from '@components/shared/actionable/DeleteConfirmationModal';

interface ControlEntityCardProps extends Omit<CardProps, 'header'> {
  headerParams: { title: string; subtitle?: string };
  onConfirmDelete: () => void;
}

export const ControlEntityCard: FC<ControlEntityCardProps> = ({
  headerParams: { title, subtitle },
  onConfirmDelete,
  ...props
}) => {
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);

  const onDeletePress = () => setShouldShowModal(!shouldShowModal);

  const onYesPress = () => {
    setShouldShowModal(false);
    onConfirmDelete();
  };

  const renderHeader: RenderProp<ViewProps> = (headerViewProps) => (
    <View
      {...headerViewProps}
      style={[
        tailwind('w-full flex-row justify-between'),
        headerViewProps?.style,
      ]}>
      <View>
        <Text category={'h4'}>{title}</Text>
        <Text category={'label'} appearance={'hint'}>
          {subtitle ?? 'Control entity'}
        </Text>
      </View>
      <Button
        accessoryLeft={renderIcon('trash-outline')}
        appearance={'ghost'}
        status={'basic'}
        size={'small'}
        onPress={onDeletePress}
      />
    </View>
  );

  return (
    <>
      <Card disabled {...props} header={renderHeader} />

      <DeleteConfirmationModal
        visible={shouldShowModal}
        onBackdropPress={() => setShouldShowModal(false)}
        itemName={title}
        onYesPress={onYesPress}
      />
    </>
  );
};
