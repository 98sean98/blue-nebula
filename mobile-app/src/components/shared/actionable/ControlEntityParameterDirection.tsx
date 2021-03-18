import React, { FC } from 'react';
import { View, ViewProps } from 'react-native';

import { tailwind } from '@styles/tailwind';

import { Direction } from '@models/control-entity';

import { ResponsiveButton } from '@components/shared/actionable/button/ResponsiveButton';

interface ControlEntityParameterDirectionProps extends ViewProps {
  currentDirection: Direction;
  onChange: (direction: Direction) => void;
}

export const ControlEntityParameterDirection: FC<ControlEntityParameterDirectionProps> = ({
  currentDirection,
  onChange,
  ...props
}) => {
  return (
    <View
      {...props}
      style={[tailwind('flex-row items-center'), props?.style ?? {}]}>
      <ResponsiveButton
        isSelected={currentDirection === Direction.CCW}
        onSelected={() => onChange(Direction.CCW)}>
        CCW
      </ResponsiveButton>
      <ResponsiveButton
        isSelected={currentDirection === Direction.CW}
        onSelected={() => onChange(Direction.CW)}>
        CW
      </ResponsiveButton>
    </View>
  );
};
