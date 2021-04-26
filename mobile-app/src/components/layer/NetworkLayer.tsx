import React, { FC, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';

import { serverUrl } from '@config/environment';

NetInfo.configure({
  reachabilityUrl: serverUrl.main,
  reachabilityTest: async (response) => response.status === 200,
  reachabilityRequestTimeout: 10 * 1000, // 10 seconds
});

export const NetworkLayer: FC = ({ children }) => {
  const { t } = useTranslation();

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [isNetworkConnected, setIsNetworkConnected] = useState<boolean>(false);

  useEffect(() => {
    NetInfo.fetch()
      .then(({ isConnected }) => {
        setIsNetworkConnected(Boolean(isConnected));
        setIsFirstLoad(false);
      })
      .catch((error) => {
        console.log(error);
        setIsFirstLoad(false);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ type, isConnected }) => {
      console.log('network info:', { type, isConnected });
      setIsNetworkConnected(Boolean(isConnected));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isFirstLoad && !isNetworkConnected) {
      Alert.alert(
        t('network.not connected'),
        t('network.connect to the internet'),
      );
    }
  }, [isFirstLoad, isNetworkConnected, t]);

  return <>{isNetworkConnected ? children : null}</>;
};
