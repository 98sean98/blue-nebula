import { ExampleCounterConstants } from './constants';

import { Decrement, Increment, IncrementAsync } from './types';

export const incrementExampleCounter = (
  payload: Increment, // required action arg
) =>
  ({
    type: ExampleCounterConstants.INCREMENT,
    payload,
  } as const);

export const decrementExampleCounter = (
  payload?: Decrement, // optional action arg
) =>
  ({
    type: ExampleCounterConstants.DECREMENT,
    payload,
  } as const);

export const incrementAsyncExampleCounter = (payload: IncrementAsync) =>
  ({ type: ExampleCounterConstants.INCREMENT_ASYNC, payload } as const);

/**
 * @description union of all the actions by using ReturnType to get the return type of each function
 * @guide https://www.carlrippon.com/managing-app-state-with-redux-and-typescript-p1/
 */
export type IncrementExampleCounterAction = ReturnType<
  typeof incrementExampleCounter
>;

export type DecrementExampleCounterAction = ReturnType<
  typeof decrementExampleCounter
>;

export type IncrementAsyncExampleCounterAction = ReturnType<
  typeof incrementAsyncExampleCounter
>;

export type ExampleCounterActionTypes =
  | IncrementExampleCounterAction
  | DecrementExampleCounterAction
  | IncrementAsyncExampleCounterAction;
