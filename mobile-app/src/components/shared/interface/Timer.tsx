import React, { FC, useEffect, useMemo, useState } from 'react';
import { Text, TextProps } from '@ui-kitten/components';

import { getDurationMoment } from '@utilities/functions/getDurationMoment';

interface TimerProps extends TextProps {
  initialTimerSeconds: number;
  shouldRun: boolean;
  shouldReset?: boolean;
  onResetComplete?: () => void;
}

const moment = getDurationMoment();

export const Timer: FC<TimerProps> = ({
  initialTimerSeconds,
  shouldRun,
  shouldReset,
  onResetComplete,
  ...props
}) => {
  const [timerSeconds, setTimerSeconds] = useState<number>(
    Math.floor(initialTimerSeconds),
  );

  const timerText = useMemo(
    () =>
      moment
        .duration(timerSeconds, 'seconds')
        .format('hh:mm:ss', { trim: false }),
    [timerSeconds],
  );

  useEffect(() => {
    if (shouldRun) {
      const interval = setInterval(
        () =>
          setTimerSeconds((currentTimerSeconds) =>
            currentTimerSeconds > 0 ? currentTimerSeconds - 1 : 0,
          ),
        1000,
      );
      return () => clearInterval(interval);
    }
  }, [shouldRun]);

  useEffect(() => setTimerSeconds(initialTimerSeconds), [initialTimerSeconds]);

  useEffect(() => {
    if (shouldReset) {
      setTimerSeconds(initialTimerSeconds);
      if (typeof onResetComplete !== 'undefined') onResetComplete();
    }
  }, [initialTimerSeconds, shouldReset, onResetComplete]);

  return <Text {...props}>{timerText}</Text>;
};
