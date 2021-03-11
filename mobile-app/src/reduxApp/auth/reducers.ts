import { AuthConstants } from './constants';
import { AuthState } from './types';
import { AuthActionTypes } from './actions';

const initialState: AuthState = {
  authorizationToken: undefined,
  user: undefined,
};

export const authReducer = (
  state = initialState,
  action: AuthActionTypes,
): AuthState => {
  switch (action.type) {
    case AuthConstants.SET_AUTHORIZATION_TOKEN:
      return { ...state, authorizationToken: action.payload };
    case AuthConstants.SET_USER:
      return { ...state, user: action.payload };
    default:
      // saga actions would just return the state
      return state;
  }
};
