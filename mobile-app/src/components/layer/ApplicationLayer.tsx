import React, { FC, useEffect } from 'react';
import {
  Alert,
  // View
} from 'react-native';
// import { Modal } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

// import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';
import { setApplicationError } from '@reduxApp/application/actions';

// import { getBackdropStyle } from '@utilities/functions/ui';

export const ApplicationLayer: FC = ({ children }) => {
  const dispatch = useDispatch();

  const {
    // isLoading,
    applicationError,
  } = useSelector((state: RootState) => state.application);

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

      {/*<Modal visible={isLoading} style={tailwind('w-full h-full')}>*/}
      {/*  <View style={[{ flex: 1 }, getBackdropStyle()]} />*/}
      {/*</Modal>*/}
    </>
  );
};
