import React, { FC, useCallback } from 'react';
import { ScrollView, View, ViewProps } from 'react-native';
import { Button, Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { useAppMakerContext } from '@utilities/hooks';
import { initialiseNewPage } from '@utilities/functions/initialiseNewPage';

interface MakerConfigurationProps extends ViewProps {}

export const MakerConfiguration: FC<MakerConfigurationProps> = ({
  ...props
}) => {
  const { config, setConfig, setShouldExpandConfigView } = useAppMakerContext();

  const createNewPage = useCallback(() => {
    setConfig((thisConfig) => {
      const pageCount = Object.keys(thisConfig.pages).length;
      return {
        ...thisConfig,
        pages: { ...thisConfig.pages, [pageCount]: initialiseNewPage() },
      };
    });
  }, [setConfig]);

  const onFirstPageCreatePress = () => {
    setShouldExpandConfigView(true);
    createNewPage();
  };

  return (
    <View {...props}>
      {Object.entries(config.pages).length === 0 ? (
        <View style={tailwind('mt-1 px-4 flex-row')}>
          <Text style={tailwind('w-4/5')}>
            Your app does not have any pages yet. Create the first one?
          </Text>
          <Button appearance={'ghost'} onPress={onFirstPageCreatePress}>
            Yes
          </Button>
        </View>
      ) : (
        <ScrollView
          style={tailwind('bg-red-100')}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};
