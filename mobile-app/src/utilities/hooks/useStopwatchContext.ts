import { useContext } from 'react';

import { StopwatchContext } from '@utilities/context/StopwatchContext';

export const useStopwatchContext = () => useContext(StopwatchContext);
