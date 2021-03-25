import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';

import { SetApplicationError } from '@reduxApp/application/types';
import {
  setApplicationError,
  setIsLoading,
} from '@reduxApp/application/actions';

export const useApplicationMutation = (
  args: Parameters<typeof useMutation>,
  errorConfig: Partial<SetApplicationError>,
): ReturnType<typeof useMutation> => {
  const dispatch = useDispatch();

  const returnTuple = useMutation(...args);

  const [, returnObject] = returnTuple;

  // loading effect
  useEffect(() => {
    dispatch(setIsLoading(returnObject.loading));
  }, [dispatch, returnObject.loading]);

  // error effect
  useEffect(() => {
    if (typeof returnObject.error !== 'undefined')
      dispatch(
        setApplicationError({
          title: 'Mutation Error',
          message: 'There was an error mutating the data in the server.',
          ...errorConfig,
        }),
      );
  }, [dispatch, returnObject.error, errorConfig]);

  return returnTuple;
};
