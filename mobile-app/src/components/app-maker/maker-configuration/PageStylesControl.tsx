import React, { FC } from 'react';
import { TextStyle } from 'react-native';
import { Layout, Text, LayoutProps } from '@ui-kitten/components';
import deepmerge from 'deepmerge';

import { tailwind } from '@styles/tailwind';

import { Page, Pages } from '@models/app-maker';

import { SliderInput } from '@components/shared/actionable';

import { useAppMakerContext } from '@utilities/hooks';

interface PageStylesControlProps extends LayoutProps {
  pageIndex: number;
  page: Page;
}

export const PageStylesControl: FC<PageStylesControlProps> = ({
  pageIndex,
  page,
  ...props
}) => {
  const { cachedPages, setCachedPages } = useAppMakerContext();

  const onBoxTextStyleChange = (styleKey: keyof TextStyle, value: unknown) => {
    const updatedPage: Page = deepmerge(page, {
      styles: { box: { text: { [styleKey]: value } } },
    });
    const updatedPages: Pages = { ...cachedPages, [pageIndex]: updatedPage };
    setCachedPages(updatedPages);
  };

  return (
    <Layout {...props} style={[tailwind('p-2'), props?.style ?? {}]}>
      <Text category={'h6'}>Display styles</Text>
      <Layout style={tailwind('mt-2 p-1')} level={'2'}>
        <Text category={'s1'}>Box</Text>
        <SliderInput
          title={'Text font size'}
          sliderProps={{
            minimumValue: 8,
            maximumValue: 40,
            step: 2,
            value: page.styles.box.text.fontSize,
            onSlidingComplete: (value) =>
              onBoxTextStyleChange('fontSize', value),
          }}
        />
      </Layout>
    </Layout>
  );
};
