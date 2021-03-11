import { combineReducers } from 'redux';

import { authReducer } from './auth';
import { bluetoothReducer } from './bluetooth';
import { builderReducer } from './builder';
import { controlReducer } from './control';
import { settingsReducer } from './settings';

export const rootReducer = combineReducers({
  auth: authReducer,
  bluetooth: bluetoothReducer,
  builder: builderReducer,
  control: controlReducer,
  settings: settingsReducer,
});

// infer the root state from reducers
export type RootState = ReturnType<typeof rootReducer>;
