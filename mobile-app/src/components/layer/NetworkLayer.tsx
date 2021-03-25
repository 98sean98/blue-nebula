import React, { FC, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const NetworkLayer: FC = ({ children }) => {
  const [isNetworkConnected, setIsNetworkConnected] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ type, isConnected }) => {
      console.log('network info', { type, isConnected });
      setIsNetworkConnected(Boolean(isConnected));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isNetworkConnected) {
      // delay the first network status check
      const timeout = setTimeout(
        () =>
          Alert.alert(
            'Network Not Connected',
            'Please connect to the internet.',
          ),
        1000,
      );
      return () => clearTimeout(timeout);
    }
  }, [isNetworkConnected]);

  return <>{isNetworkConnected ? children : null}</>;
};
