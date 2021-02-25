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

const getIsScrollingEnabled = ({
  rows,
  columns,
  boxCount,
}: Layout): boolean => {
  const boxesInView = rows * columns;
  return boxesInView < boxCount;
};

export const LayoutDivider: FC<LayoutDividerProps> = ({
  pageKey,
  layout,
  renderItem,
  boxes,
  ...props
}) => {
  const { rows, columns } = layout;

  const [componentLayout, setComponentLayout] = useState<LayoutRectangle>();

  const onLayout = (e: LayoutChangeEvent) => {
    const {
      nativeEvent: { layout: newLayout },
    } = e;
    setComponentLayout(newLayout);
    if (typeof props?.onLayout !== 'undefined') props.onLayout(e);
  };

  const styles = StyleSheet.create({
    box: {
      height:
        (componentLayout?.height ?? Dimensions.get('window').height) / rows,
      width:
        (componentLayout?.width ?? Dimensions.get('window').width) / columns,
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
      onLayout={onLayout}
      scrollEnabled={getIsScrollingEnabled(layout)}>
      {Object.entries(boxes).map(([boxKey, box]) => (
        <View key={boxKey} style={styles.box}>
          {renderItem({ pageKey, boxKey, box })}
        </View>
      ))}
    </ScrollView>
  );
};
