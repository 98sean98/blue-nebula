import React, { FC, useState } from 'react';

import { StopwatchContext } from '@utilities/context';

export const StopwatchLayer: FC = ({ children }) => {
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);

  return (
    <StopwatchContext.Provider
      value={{ stopwatchSeconds, setStopwatchSeconds }}>
      {children}
    </StopwatchContext.Provider>
  );
};
