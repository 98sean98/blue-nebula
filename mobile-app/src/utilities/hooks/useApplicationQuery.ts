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

  // loading effect
  useEffect(() => {
    dispatch(setIsLoading(returnObject.loading));
  }, [dispatch, returnObject.loading]);

  // error effect
  useEffect(() => {
    if (typeof returnObject.error !== 'undefined')
      dispatch(
        setApplicationError({
          title: 'Query Error',
          message: 'There was an error querying for data from the server.',
          ...errorConfig,
        }),
      );
  }, [dispatch, returnObject.error, errorConfig]);

  return returnObject;
};
