import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Layout, LayoutProps, Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { parseTimerText } from '@utilities/functions/parse';
import { useTimerContext } from '@utilities/hooks';

interface TimerProps extends LayoutProps {
  shouldRun: boolean;
  onHardReset?: () => void;
}

export const Timer: FC<TimerProps> = ({ shouldRun, onHardReset, ...props }) => {
  const { timerSeconds, setTimerSeconds } = useTimerContext();

  useEffect(() => {
    if (shouldRun) {
      const interval = setInterval(
        () => setTimerSeconds((currentTimerSeconds) => currentTimerSeconds + 1),
        1000,
      );
      return () => clearInterval(interval);
    }
  }, [shouldRun, setTimerSeconds]);

  const onResetPress = () => {
    if (shouldRun && typeof onHardReset !== 'undefined') onHardReset();
    setTimerSeconds(0);
  };

  const text = {
    hour: parseTimerText(timerSeconds / 3600),
    minute: parseTimerText((timerSeconds % 3600) / 60),
    second: parseTimerText(timerSeconds % 60),
  };

  return (
    <Layout {...props}>
      <View style={tailwind('flex-row justify-between items-center')}>
        <Text>{`${text.hour}: ${text.minute}: ${text.second}`}</Text>
        <Button appearance={'ghost'} status={'warning'} onPress={onResetPress}>
          Reset Timer
        </Button>
      </View>
    </Layout>
  );
};
