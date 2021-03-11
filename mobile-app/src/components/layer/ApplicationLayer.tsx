import React, { FC, useEffect } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';
import { setApplicationError } from '@reduxApp/application/actions';

import { getBackdropStyle } from '@utilities/functions/ui';

export const ApplicationLayer: FC = ({ children }) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { isLoading, applicationError } = useSelector(
    (state: RootState) => state.application,
  );

  useEffect(() => {
    if (typeof applicationError !== 'undefined') {
      const { title, message } = applicationError;
      Alert.alert(title, message);
      dispatch(setApplicationError(undefined));
    }
  }, [dispatch, applicationError]);

  return (
    <>
      {children}

      {isLoading ? (
        <View
          style={[
            tailwind('absolute inset-0 justify-center items-center'),
            { zIndex: 999 },
            getBackdropStyle(),
          ]}>
          <ActivityIndicator
            size="large"
            animating={true}
            color={theme['color-basic-300']}
          />
        </View>
      ) : null}
    </>
  );
};
