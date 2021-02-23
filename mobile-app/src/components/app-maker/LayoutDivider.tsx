import React, { FC, ReactNode, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import { tailwind } from '@styles/tailwind';

import { Layout } from '@models/app-maker';

interface LayoutDividerProps extends ScrollViewProps {
  layout: Layout;
  renderItem: (boxIndex: number) => ReactNode;
}

export const LayoutDivider: FC<LayoutDividerProps> = ({
  layout: { rows, columns },
  renderItem,
  ...props
}) => {
  const boxCount = rows * columns;

  const [layout, setLayout] = useState<LayoutRectangle>();

  const onLayout = (e: LayoutChangeEvent) => {
    const {
      nativeEvent: { layout },
    } = e;
    setLayout(layout);
    if (typeof props?.onLayout !== 'undefined') props.onLayout(e);
  };

  const styles = StyleSheet.create({
    box: {
      height: (layout?.height ?? Dimensions.get('window').height) / rows,
      width: (layout?.width ?? Dimensions.get('window').width) / columns,
    },
  });

  return (
    <ScrollView
      {...props}
      style={[{ flex: 1 }, props?.style ?? {}]}
      contentContainerStyle={[
        tailwind('flex-row flex-wrap'),
        props?.contentContainerStyle ?? {},
      ]}
      onLayout={onLayout}>
      {Array(boxCount)
        .fill(null)
        .map((_, index) => (
          <View key={index} style={styles.box}>
            {renderItem(index)}
          </View>
        ))}
    </ScrollView>
  );
};
