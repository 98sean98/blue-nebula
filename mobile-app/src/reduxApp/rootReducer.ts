import { combineReducers } from 'redux';

import { bluetoothReducer } from './bluetooth';
import { controlReducer } from './control';
import { settingsReducer } from './settings';

export const rootReducer = combineReducers({
  bluetooth: bluetoothReducer,
  control: controlReducer,
  settings: settingsReducer,
});

// infer the root state from reducers
export type RootState = ReturnType<typeof rootReducer>;
