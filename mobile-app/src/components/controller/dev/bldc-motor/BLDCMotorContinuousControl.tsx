import React, { FC } from 'react';
import { View, ViewProps } from 'react-native';

import { BLDCMotor } from '@models/control-entity';

interface BLDCMotorContinuousControlProps extends ViewProps {
  controlEntity: BLDCMotor;
}

export const BLDCMotorContinuousControl: FC<BLDCMotorContinuousControlProps> = ({
  ...props
}) => {
  return <View {...props} />;
};
