import React, { FC, ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { tailwind } from '@styles/tailwind';

import { Layout } from '@models/app-maker/Layout';

interface LayoutDividerProps extends ViewProps {
  layout: Layout;
  renderItem: (boxIndex: number) => ReactNode;
}

export const LayoutDivider: FC<LayoutDividerProps> = ({
  layout: { rows, columns },
  renderItem,
  ...props
}) => {
  const boxCount = rows * columns;

  const styles = StyleSheet.create({
    box: {
      height: `${100 / rows}%`,
      width: `${100 / columns}%`,
    },
  });

  return (
    <View
      {...props}
      style={[{ flex: 1 }, tailwind('flex-wrap'), props?.style ?? {}]}>
      {Array(boxCount)
        .fill(null)
        .map((_, index) => (
          <View key={index} style={styles.box}>
            {renderItem(index)}
          </View>
        ))}
    </View>
  );
};
