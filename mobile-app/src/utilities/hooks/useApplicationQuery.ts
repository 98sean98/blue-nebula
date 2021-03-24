import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';

import { SetApplicationError } from '@reduxApp/application/types';
import {
  setApplicationError,
  setIsLoading,
} from '@reduxApp/application/actions';

export const useApplicationQuery = (
  args: Parameters<typeof useQuery>,
  errorConfig?: Partial<SetApplicationError>,
): ReturnType<typeof useQuery> => {
  const dispatch = useDispatch();

  const returnObject = useQuery(...args);

  const { loading, error } = returnObject;

  // loading effect
  useEffect(() => {
    dispatch(setIsLoading(loading));
  }, [dispatch, loading]);

  // error effect
  useEffect(() => {
    if (typeof error !== 'undefined')
      dispatch(
        setApplicationError({
          title: 'Query Error',
          message: 'There was an error querying for data from the server.',
          ...errorConfig,
        }),
      );
  }, [dispatch, error, errorConfig]);

  return returnObject;
};
