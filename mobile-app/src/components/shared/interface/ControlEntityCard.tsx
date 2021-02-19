import React, { FC, useState } from 'react';
import { Card, CardProps, Text, Button, Modal } from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';
import { View, ViewProps } from 'react-native';

import { tailwind } from '@styles/tailwind';

import { renderIcon } from '@components/shared/interface/renderIcon';
import { ConfirmationButtonGroup } from '@components/shared/actionable';

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
      <Modal
        visible={shouldShowModal}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setShouldShowModal(false)}>
        <Card disabled style={tailwind('m-4')}>
          <Text category={'h5'} style={tailwind('text-center')}>
            {`Are you sure you want to delete ${title}?`}
          </Text>
          <ConfirmationButtonGroup
            onNoPress={() => setShouldShowModal(false)}
            onYesPress={onYesPress}
            style={tailwind('mt-3')}
          />
        </Card>
      </Modal>
    </>
  );
};
