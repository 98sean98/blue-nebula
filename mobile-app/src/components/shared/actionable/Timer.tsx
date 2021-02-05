import React, { FC, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, Layout, LayoutProps, Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { parseTimerText } from '@utilities/functions/parse';

interface TimerProps extends LayoutProps {
  shouldRun: boolean;
  onHardReset?: () => void;
}

export const Timer: FC<TimerProps> = ({ shouldRun, onHardReset, ...props }) => {
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  const memoizedTimerSeconds = useMemo(() => timerSeconds, [timerSeconds]);

  useEffect(() => {
    console.log({ shouldRun });
    if (shouldRun) {
      const interval = setInterval(
        () => setTimerSeconds((currentTimerSeconds) => currentTimerSeconds + 1),
        1000,
      );
      return () => clearInterval(interval);
    }
  }, [shouldRun]);

  const onResetPress = () => {
    if (shouldRun && typeof onHardReset !== 'undefined') onHardReset();
    setTimerSeconds(0);
  };

  const text = {
    hour: parseTimerText(memoizedTimerSeconds / 3600),
    minute: parseTimerText((memoizedTimerSeconds % 3600) / 60),
    second: parseTimerText(memoizedTimerSeconds % 60),
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
