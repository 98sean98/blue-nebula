import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import {
  Layout as LayoutComponent,
  LayoutProps,
  Text,
} from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import deepmerge from 'deepmerge';

import { tailwind } from '@styles/tailwind';

import { Boxes, Layout, Page } from '@models/app-maker';

import { RootState } from '@reduxApp';
import { setMakerConfig } from '@reduxApp/builder/actions';

import { ThemedSlider } from '@components/shared/actionable';
import { initialiseNewBox } from '@utilities/functions/initialiseNewBox';

interface LayoutBoxProps extends LayoutProps {
  pageIndex: number;
  page: Page;
}

export const LayoutBox: FC<LayoutBoxProps> = ({
  pageIndex,
  page,
  ...props
}) => {
  const dispatch = useDispatch();

  const {
    makerConfig: { pages },
  } = useSelector((state: RootState) => state.builder);

  const layoutTypes: Array<{ type: keyof Layout; min: number; max: number }> = [
    { type: 'rows', min: 1, max: 8 },
    { type: 'columns', min: 1, max: 5 },
  ];

  const onLayoutVariableChange = useCallback(
    (type: keyof Layout, value: number) => {
      const oldBoxCount = page.layout.rows * page.layout.columns;
      let newBoxCount = 0;
      switch (type) {
        case 'rows':
          newBoxCount = page.layout.columns * value;
          break;
        case 'columns':
          newBoxCount = page.layout.rows * value;
          break;
      }
      const boxCountDifference = newBoxCount - oldBoxCount;
      const newBoxes: Boxes = {};
      if (boxCountDifference > 0)
        Array(boxCountDifference)
          .fill(null)
          .forEach((_, index) => {
            newBoxes[oldBoxCount + index] = initialiseNewBox();
          });

      const updatedPage: Page = deepmerge(page, {
        layout: { [type]: value },
        boxes: newBoxes,
      });

      dispatch(
        setMakerConfig({
          pages: { ...pages, [pageIndex]: updatedPage },
        }),
      );
    },
    [dispatch, pages, page, pageIndex],
  );

  return (
    <LayoutComponent {...props} style={[tailwind('p-2'), props?.style ?? {}]}>
      <Text category={'h6'}>Layout boxes</Text>
      {/* layout rows and columns */}
      <View style={tailwind('mt-1')}>
        {layoutTypes.map(({ type, min, max }) => (
          <View
            key={type}
            style={tailwind('w-full flex-row justify-between items-center')}>
            <Text>{type}</Text>
            <View
              style={tailwind('w-2/3 flex-row justify-between items-center')}>
              <ThemedSlider
                style={tailwind('w-11/12 h-8')}
                minimumValue={min}
                maximumValue={max}
                step={1}
                value={page.layout[type]}
                onSlidingComplete={(value: number) =>
                  onLayoutVariableChange(type, value)
                }
              />
              <Text category={'s1'}>{page.layout[type]}</Text>
            </View>
          </View>
        ))}
      </View>
    </LayoutComponent>
  );
};
