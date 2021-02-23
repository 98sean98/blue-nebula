import React, { FC } from 'react';
import { View, ViewProps } from 'react-native';
import { Page } from '@models/app-maker';

interface PageInfoProps extends ViewProps {
  focusedPage: Page;
}

export const PageInfo: FC<PageInfoProps> = ({ focusedPage, ...props }) => {
  console.log(focusedPage);

  return <View {...props} />;
};
