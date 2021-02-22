import React, { FC } from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';

import { tailwind } from '@styles/tailwind';

interface LayoutDividerProps extends ViewProps {
  layout: { rows: number; columns: number };
}

export const LayoutDivider: FC<LayoutDividerProps> = ({
  layout: { rows, columns },
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
            <Pressable style={[{ flex: 1 }, tailwind('m-1 bg-red-100')]} />
          </View>
        ))}
    </View>
  );
};
