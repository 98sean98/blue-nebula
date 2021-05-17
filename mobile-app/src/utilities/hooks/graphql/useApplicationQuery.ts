import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';

import {
  setApplicationAlert,
  setIsLoading,
} from '@reduxApp/application/actions';

import { Options } from './Options';

export const useApplicationQuery = (
  args: Parameters<typeof useQuery>,
  options?: Options,
): ReturnType<typeof useQuery> => {
  const { shouldSetIsLoading, errorConfig } = {
    shouldSetIsLoading: true,
    errorConfig: undefined,
    ...options,
  };

  const dispatch = useDispatch();

  const returnObject = useQuery(...args);

  // loading effect
  useEffect(() => {
    if (shouldSetIsLoading) dispatch(setIsLoading(returnObject.loading));
  }, [shouldSetIsLoading, dispatch, returnObject.loading]);

  // error effect
  useEffect(() => {
    if (typeof returnObject.error !== 'undefined')
      dispatch(
        setApplicationAlert({
          title: 'Query Error',
          message: 'There was an error querying for data from the server.',
          ...errorConfig,
        }),
      );
  }, [dispatch, returnObject.error, errorConfig]);

  return returnObject;
};
