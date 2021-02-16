import React, { FC } from 'react';
import { Toggle, ToggleProps } from '@ui-kitten/components';

interface ControlEntityParameterToggleProps extends ToggleProps {}

export const ControlEntityParameterToggle: FC<ControlEntityParameterToggleProps> = ({
  children,
  ...props
}) => {
  return (
    <Toggle status={'info'} {...props}>
      {children}
    </Toggle>
  );
};
