import { useContext } from 'react';

import { TimerContext } from '@utilities/context/TimerContext';

export const useTimerContext = () => useContext(TimerContext);
