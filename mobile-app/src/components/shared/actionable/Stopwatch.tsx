import React, { FC, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Button, Layout, LayoutProps, Text } from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

import { useStopwatchContext } from '@utilities/hooks';
import { getDurationMoment } from '@utilities/functions/getDurationMoment';

interface StopWatchProps extends LayoutProps {
  shouldRun: boolean;
  onHardReset?: () => void;
}

const moment = getDurationMoment();

export const Stopwatch: FC<StopWatchProps> = ({
  shouldRun,
  onHardReset,
  ...props
}) => {
  const { stopwatchSeconds, setStopwatchSeconds } = useStopwatchContext();

  useEffect(() => {
    if (shouldRun) {
      const interval = setInterval(
        () =>
          setStopwatchSeconds((currentTimerSeconds) => currentTimerSeconds + 1),
        1000,
      );
      return () => clearInterval(interval);
    }
  }, [shouldRun, setStopwatchSeconds]);

  const onResetPress = () => {
    if (shouldRun && typeof onHardReset !== 'undefined') onHardReset();
    setStopwatchSeconds(0);
  };

  const stopwatchText = useMemo(
    () =>
      moment
        .duration(stopwatchSeconds, 'seconds')
        .format('hh:mm:ss', { trim: false }),
    [stopwatchSeconds],
  );

  return (
    <Layout {...props}>
      <View style={tailwind('flex-row justify-between items-center')}>
        <Text>{stopwatchText}</Text>
        <Button appearance={'ghost'} status={'warning'} onPress={onResetPress}>
          Reset Stopwatch
        </Button>
      </View>
    </Layout>
  );
};
