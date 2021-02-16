import { combineReducers } from 'redux';

import { bluetoothReducer } from './bluetooth';
import { controlReducer } from './control';

export const rootReducer = combineReducers({
  bluetooth: bluetoothReducer,
  control: controlReducer,
});

// infer the root state from reducers
export type RootState = ReturnType<typeof rootReducer>;
