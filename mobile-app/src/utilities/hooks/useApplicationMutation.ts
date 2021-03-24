import { useMutation } from '@apollo/client';
import { SetApplicationError } from '@reduxApp/application/types';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  setApplicationError,
  setIsLoading,
} from '@reduxApp/application/actions';

export const useApplicationMutation = (
  args: Parameters<typeof useMutation>,
  errorConfig: Partial<SetApplicationError>,
): ReturnType<typeof useMutation> => {
  const dispatch = useDispatch();

  const returnObject = useMutation(...args);

  const [, { loading, error }] = returnObject;

  // loading effect
  useEffect(() => {
    dispatch(setIsLoading(loading));
  }, [dispatch, loading]);

  // error effect
  useEffect(() => {
    if (typeof error !== 'undefined')
      dispatch(
        setApplicationError({
          title: 'Mutation Error',
          message: 'There was an error mutating the data in the server.',
          ...errorConfig,
        }),
      );
  }, [dispatch, error, errorConfig]);

  return returnObject;
};
