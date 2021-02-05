import React, { FC } from 'react';
import { Card, CardProps, Text } from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';
import { View, ViewProps } from 'react-native';

interface ControlEntityCardProps extends CardProps {
  headerParams: { title: string; subtitle?: string };
}

export const ControlEntityCard: FC<ControlEntityCardProps> = ({
  headerParams: { title, subtitle },
  ...props
}) => {
  const renderHeader: RenderProp<ViewProps> = (headerViewProps) => (
    <View {...headerViewProps}>
      <Text category={'h4'}>{title}</Text>
      <Text category={'label'} appearance={'hint'}>
        {subtitle ?? 'Step motor control'}
      </Text>
    </View>
  );

  return <Card disabled header={renderHeader} {...props} />;
};
