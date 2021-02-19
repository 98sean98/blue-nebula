import React, { FC } from 'react';
import { Card, Modal, ModalProps, Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { ConfirmationButtonGroup } from '@components/shared/actionable/ConfirmationButtonGroup';

interface DeleteConfirmationModalProps extends ModalProps {
  onBackdropPress: () => void;
  itemName: string;
  onYesPress: () => void;
}

export const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
  itemName,
  onYesPress,
  ...props
}) => {
  const onNoPress = props.onBackdropPress;

  return (
    <Modal backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} {...props}>
      <Card disabled style={tailwind('m-4')}>
        <Text category={'h6'} style={tailwind('text-center')}>
          {`Are you sure you want to delete `}
          {
            <Text category={'h6'} status={'warning'}>
              {itemName}
            </Text>
          }
          {` ?`}
        </Text>
        <ConfirmationButtonGroup
          onNoPress={onNoPress}
          onYesPress={onYesPress}
          style={tailwind('mt-3')}
        />
      </Card>
    </Modal>
  );
};
