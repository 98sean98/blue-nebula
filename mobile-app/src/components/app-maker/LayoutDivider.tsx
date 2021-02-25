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

import { Box, Boxes, Layout, Pages } from '@models/app-maker';

interface LayoutDividerProps extends ScrollViewProps {
  pageKey: keyof Pages;
  layout: Layout;
  boxes: Boxes;
  renderItem: (item: {
    pageKey: keyof Pages;
    boxKey: keyof Boxes;
    box: Box;
  }) => ReactNode;
}

export const LayoutDivider: FC<LayoutDividerProps> = ({
  pageKey,
  layout: { rows, columns },
  renderItem,
  boxes,
  ...props
}) => {
  const [layout, setLayout] = useState<LayoutRectangle>();

  const onLayout = (e: LayoutChangeEvent) => {
    const {
      nativeEvent: { layout: newLayout },
    } = e;
    setLayout(newLayout);
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
      {Object.entries(boxes).map(([boxKey, box]) => (
        <View key={boxKey} style={styles.box}>
          {renderItem({ pageKey, boxKey, box })}
        </View>
      ))}
    </ScrollView>
  );
};
