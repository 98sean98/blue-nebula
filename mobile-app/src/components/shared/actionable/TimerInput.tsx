import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { sentenceCase } from 'change-case';

import { tailwind } from '@styles/tailwind';

interface TimerInputProps extends ViewProps {
  value: number; // in seconds
  onChange: (value: number) => void;
}

type Timer = { hour: number; minute: number; second: number };

const timerConstraints: Record<keyof Timer, { min: number; max: number }> = {
  hour: { min: 0, max: 23 },
  minute: { min: 0, max: 59 },
  second: { min: 0, max: 59 },
};

export const TimerInput: FC<TimerInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  const [timer, setTimer] = useState<Timer>({
    hour: 0,
    minute: 0,
    second: 0,
  });

  const onTimerComponentChange = useCallback(
    (key: keyof Timer, timerValue: number) => {
      const newTimer = { ...timer, [key]: timerValue };
      setTimer(newTimer);
      const { hour, minute, second } = newTimer;
      const newValue = hour * 3600 + minute * 60 + second;
      onChange(newValue);
    },
    [onChange, timer],
  );

  useEffect(() => {
    const newTimer = {
      hour: Math.floor(value / 3600),
      minute: Math.floor((value % 3600) / 60),
      second: Math.floor(value % 60),
    };
    setTimer(newTimer);
  }, [value]);

  return (
    <View
      {...props}
      style={[tailwind('flex-row justify-between'), props?.style ?? {}]}>
      {Object.entries(timerConstraints).map(([key, { min, max }]) => (
        <Select
          key={key}
          value={timer[key as keyof Timer].toString()}
          selectedIndex={new IndexPath(timer[key as keyof Timer])}
          onSelect={(index) =>
            onTimerComponentChange(key as keyof Timer, (index as IndexPath).row)
          }
          label={sentenceCase(key)}
          style={[{ width: '32%' }]}>
          {Array(max - min + 1)
            .fill(null)
            .map((_, index) => (
              <SelectItem key={index} title={index.toString()} />
            ))}
        </Select>
      ))}
    </View>
  );
};
