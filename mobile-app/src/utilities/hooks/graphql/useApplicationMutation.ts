import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';

import {
  setApplicationAlert,
  setIsLoading,
} from '@reduxApp/application/actions';

import { Options } from './Options';

export const useApplicationMutation = (
  args: Parameters<typeof useMutation>,
  options?: Options,
): ReturnType<typeof useMutation> => {
  const { shouldSetIsLoading, errorConfig } = {
    shouldSetIsLoading: true,
    errorConfig: undefined,
    ...options,
  };

  const dispatch = useDispatch();

  const returnTuple = useMutation(...args);

  const [, returnObject] = returnTuple;

  // loading effect
  useEffect(() => {
    if (shouldSetIsLoading) dispatch(setIsLoading(returnObject.loading));
  }, [shouldSetIsLoading, dispatch, returnObject.loading]);

  // error effect
  useEffect(() => {
    if (typeof returnObject.error !== 'undefined')
      dispatch(
        setApplicationAlert({
          title: 'Mutation Error',
          message: 'There was an error mutating the data in the server.',
          ...errorConfig,
        }),
      );
  }, [dispatch, returnObject.error, errorConfig]);

  return returnTuple;
};
