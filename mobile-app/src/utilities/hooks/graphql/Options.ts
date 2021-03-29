import { SetApplicationError } from '@reduxApp/application/types';

export type Options = {
  shouldSetIsLoading?: boolean;
  errorConfig?: Partial<SetApplicationError>;
};
