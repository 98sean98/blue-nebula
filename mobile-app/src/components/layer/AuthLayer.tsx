import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/client';

import { RootState } from '@reduxApp';
import { checkIsAuthenticatedAsync, setUser } from '@reduxApp/auth/actions';
import {
  setApplicationAlert,
  setApplicationMode,
} from '@reduxApp/application/actions';

import { ApplicationMode } from '@models/application';

import { GET_ME } from '@api/graphql/user';

export const AuthLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const authorizationToken = useSelector(
    (state: RootState) => state.auth.authorizationToken,
  );

  // check if validity of authorization token
  useEffect(() => {
    if (typeof authorizationToken !== 'undefined')
      dispatch(checkIsAuthenticatedAsync());
  }, [dispatch, authorizationToken]);

  // set application mode based on authorization token
  useEffect(() => {
    if (typeof authorizationToken !== 'undefined')
      dispatch(setApplicationMode(ApplicationMode.GAME_MASTER));
    else dispatch(setApplicationMode(ApplicationMode.NORMAL));
  }, [dispatch, authorizationToken]);

  // lazily fetch user data based on authorization token
  const [fetchMe, { data, error }] = useLazyQuery(GET_ME);
  useEffect(() => {
    if (typeof authorizationToken !== 'undefined') fetchMe();
  }, [authorizationToken, fetchMe]);
  useEffect(() => {
    if (
      typeof data !== 'undefined' &&
      data?.me &&
      data.me.__typename === 'User'
    ) {
      dispatch(setUser({ ...data.me }));
    }
  }, [dispatch, data]);
  useEffect(() => {
    if (typeof error !== 'undefined')
      dispatch(
        setApplicationAlert({
          title: 'Fetch User Error',
          message: 'There was an error fetching your user data.',
        }),
      );
  }, [dispatch, error]);

  return <>{children}</>;
};
