import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import {
  Layout as LayoutComponent,
  LayoutProps,
  Text,
} from '@ui-kitten/components';
import deepmerge from 'deepmerge';
import { sentenceCase } from 'change-case';

import { tailwind } from '@styles/tailwind';

import { Boxes, Layout, Page } from '@models/app-maker';

import { SliderInput } from '@components/shared/actionable';

import { useAppMakerContext } from '@utilities/hooks';
import { initialiseNewBox } from '@utilities/functions/app-maker';

interface LayoutBoxControlProps extends LayoutProps {
  pageIndex: number;
  page: Page;
  disabled?: boolean;
}

const layoutTypes: Array<{ type: keyof Layout; min: number; max: number }> = [
  { type: 'boxCount', min: 1, max: 40 },
  { type: 'rows', min: 1, max: 8 },
  { type: 'columns', min: 1, max: 5 },
];

export const LayoutBoxControl: FC<LayoutBoxControlProps> = ({
  pageIndex,
  page,
  disabled,
  ...props
}) => {
  const { setCachedPages } = useAppMakerContext();

  const onLayoutVariableChange = useCallback(
    (type: keyof Layout, value: number) => {
      const newBoxes: Boxes = {};
      if (type === 'boxCount') {
        const oldBoxCount = page.layout.boxCount;
        const boxCountDifference = value - oldBoxCount;
        if (boxCountDifference > 0)
          Array(boxCountDifference)
            .fill(null)
            .forEach((_, index) => {
              newBoxes[oldBoxCount + index] = initialiseNewBox();
            });
      }

      const updatedPage: Page = deepmerge(page, {
        layout: { [type]: value },
        boxes: newBoxes,
      });

      setCachedPages((cachedPages) => ({
        ...cachedPages,
        [pageIndex]: updatedPage,
      }));
    },
    [setCachedPages, page, pageIndex],
  );

  return (
    <LayoutComponent
      {...props}
      style={[
        tailwind('p-2'),
        disabled ? tailwind('opacity-50') : {},
        props?.style ?? {},
      ]}
      pointerEvents={disabled ? 'none' : undefined}>
      <Text category={'h6'}>Layout boxes</Text>
      {/* layout rows and columns */}
      <View style={tailwind('mt-1')}>
        {layoutTypes.map(({ type, min, max }) => (
          <SliderInput
            key={type}
            title={sentenceCase(type)}
            sliderProps={{
              minimumValue: min,
              maximumValue: max,
              step: 1,
              value: page.layout[type],
              onSlidingComplete: (value: number) =>
                onLayoutVariableChange(type, value),
            }}
          />
        ))}
      </View>
    </LayoutComponent>
  );
};
