// types and interfaces for feature

// action payload
export type Increment = number;

export type Decrement = number;

export type IncrementAsync = {
  incrementBy: number;
  delay?: number;
};

// feature state
export type ExampleCounterState = {
  readonly counter: number;
};
