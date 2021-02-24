import React, { ComponentProps, FC } from 'react';

import { PressableBox } from '@components/shared/actionable';
import { Box, Boxes } from '@models/app-maker';

interface MakerBoxProps extends Partial<ComponentProps<typeof PressableBox>> {
  boxKey: keyof Boxes;
  box: Box;
}

export const MakerBox: FC<MakerBoxProps> = ({
  // boxKey,
  box: { title },
  ...props
}) => {
  return <PressableBox text={title} {...props} />;
};
