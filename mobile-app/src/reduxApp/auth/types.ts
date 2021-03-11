import { LoginCredentials, User } from '@models/auth';

// types and interfaces for feature

// action payload
export type SetAuthorizationToken = string | undefined;

export type SetUser = User;

export type LoginAsync = LoginCredentials;

// feature state
export type AuthState = {
  readonly authorizationToken: string | undefined;
  readonly user: User | undefined;
};
