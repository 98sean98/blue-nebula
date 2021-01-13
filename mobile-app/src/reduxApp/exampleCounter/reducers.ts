import { ExampleCounterConstants } from './constants';
import { ExampleCounterState } from './types';
import { ExampleCounterActionTypes } from './actions';

const initialState: ExampleCounterState = {
  counter: 0,
};

export const exampleCounterReducer = (
  state = initialState,
  action: ExampleCounterActionTypes,
): ExampleCounterState => {
  switch (action.type) {
    case ExampleCounterConstants.INCREMENT:
      return { ...state, counter: state.counter + action.payload };
    case ExampleCounterConstants.DECREMENT:
      return { ...state, counter: state.counter - (action.payload || 1) };
    default:
      // saga actions would just return the state
      return state;
  }
};
