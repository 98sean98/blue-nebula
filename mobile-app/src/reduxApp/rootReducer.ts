import { combineReducers } from 'redux';
import { exampleCounterReducer } from './exampleCounter';
import { bluetoothReducer } from './bluetooth';

export const rootReducer = combineReducers({
  exampleCounter: exampleCounterReducer,
  bluetooth: bluetoothReducer,
});

// infer the root state from reducers
export type RootState = ReturnType<typeof rootReducer>;
