import { createContext, Dispatch, SetStateAction } from 'react';

type StopwatchContext = {
  stopwatchSeconds: number;
  setStopwatchSeconds: Dispatch<SetStateAction<number>>;
};

const initialStopwatchContext: StopwatchContext = {
  stopwatchSeconds: 0,
  setStopwatchSeconds: () => {},
};

export const StopwatchContext = createContext<StopwatchContext>(
  initialStopwatchContext,
);
