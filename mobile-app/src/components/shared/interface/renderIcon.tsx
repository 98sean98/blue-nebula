import React from 'react';
import { ImageProps } from 'react-native';
import { Icon, IconProps } from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';

export const renderIcon = (
  iconName: string,
  iconProps?: Partial<IconProps>,
): RenderProp<Partial<ImageProps>> => (props) => (
  <Icon {...props} {...iconProps} name={iconName} />
);
