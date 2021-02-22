import React, { FC } from 'react';
import { Card, Modal, ModalProps, Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { ConfirmationButtonGroup } from '@components/shared/actionable/button/ConfirmationButtonGroup';

interface ConfirmationModalProps extends ModalProps {
  onBackdropPress: () => void;
  action: string;
  itemName: string;
  onYesPress: () => void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  action,
  itemName,
  onYesPress,
  ...props
}) => {
  const onNoPress = props.onBackdropPress;

  return (
    <Modal backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} {...props}>
      <Card disabled style={tailwind('m-4')}>
        <Text category={'h6'} style={tailwind('text-center')}>
          {`Are you sure you want to ${action} `}
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
