import { createContext, Dispatch, SetStateAction } from 'react';

type TimerContext = {
  timerSeconds: number;
  setTimerSeconds: Dispatch<SetStateAction<number>>;
};

const initialTimerContext: TimerContext = {
  timerSeconds: 0,
  setTimerSeconds: () => {},
};

export const TimerContext = createContext<TimerContext>(initialTimerContext);
