import React, { FC, memo } from 'react';
import { View } from 'react-native';
import { LayoutProps, Layout, Text } from '@ui-kitten/components';
import { sentenceCase } from 'change-case';

import { tailwind } from '@styles/tailwind';

import { ControlEntities } from '@models/control-entity';

import { parseFromTypeToString } from '@utilities/functions/parse';

interface ControlEntitySummaryProps extends LayoutProps {
  controlEntities: ControlEntities;
}

export const ControlEntitySummary: FC<ControlEntitySummaryProps> = memo(
  ({ controlEntities, ...props }) => {
    return (
      <Layout {...props}>
        {Object.values(controlEntities).map((controlEntity, i) => (
          <Layout
            key={i}
            level={'2'}
            style={[
              i !== 0 ? tailwind('mt-2') : undefined,
              tailwind('p-2 rounded'),
            ]}>
            {typeof controlEntity === 'object'
              ? Object.entries(controlEntity).map(([param, value], j) => (
                  <View
                    key={j}
                    style={tailwind('flex-row flex-wrap justify-between')}>
                    <Text appearance={'hint'}>{`${sentenceCase(param)}:`}</Text>
                    <Text>{parseFromTypeToString(value)}</Text>
                  </View>
                ))
              : null}
          </Layout>
        ))}
      </Layout>
    );
  },
);
