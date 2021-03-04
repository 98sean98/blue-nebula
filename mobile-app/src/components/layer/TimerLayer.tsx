import React, { FC, useState } from 'react';

import { TimerContext } from '@utilities/context';

export const TimerLayer: FC = ({ children }) => {
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  return (
    <TimerContext.Provider value={{ timerSeconds, setTimerSeconds }}>
      {children}
    </TimerContext.Provider>
  );
};
