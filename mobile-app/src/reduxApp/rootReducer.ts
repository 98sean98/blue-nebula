import { combineReducers } from 'redux';
import { exampleCounterReducer } from './exampleCounter';

export const rootReducer = combineReducers({
  exampleCounter: exampleCounterReducer,
});

// infer the root state from reducers
export type RootState = ReturnType<typeof rootReducer>;
