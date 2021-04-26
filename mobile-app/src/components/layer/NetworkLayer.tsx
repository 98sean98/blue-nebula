import React, { FC, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';

import { serverUrl } from '@config/environment';

NetInfo.configure({
  reachabilityUrl: serverUrl.main,
  reachabilityTest: async (response) => response.status === 200,
});

export const NetworkLayer: FC = ({ children }) => {
  const { t } = useTranslation();

  const [isNetworkConnected, setIsNetworkConnected] = useState<boolean>(false);

  useEffect(() => {
    NetInfo.fetch()
      .then(({ isInternetReachable }) => {
        setIsNetworkConnected(Boolean(isInternetReachable));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(
      ({ type, isInternetReachable }) => {
        console.log('network info:', { type, isInternetReachable });
        setIsNetworkConnected(Boolean(isInternetReachable));
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isNetworkConnected) {
      // delay network status error alert
      const timeout = setTimeout(
        () =>
          Alert.alert(
            t('network.not connected'),
            t('network.connect to the internet'),
          ),
        3000,
      );
      return () => clearTimeout(timeout);
    }
  }, [isNetworkConnected, t]);

  return <>{isNetworkConnected ? children : null}</>;
};
