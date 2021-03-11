import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@reduxApp';
import { checkIsAuthenticatedAsync } from '@reduxApp/auth/actions';
import { setApplicationMode } from '@reduxApp/application/actions';

import { ApplicationMode } from '@models/application';

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

  useEffect(() => {
    if (typeof authorizationToken !== 'undefined')
      dispatch(setApplicationMode(ApplicationMode.GAME_MASTER));
    else dispatch(setApplicationMode(ApplicationMode.NORMAL));
  }, [dispatch, authorizationToken]);

  return <>{children}</>;
};
