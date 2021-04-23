import React, { FC, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useTranslation } from 'react-i18next';

export const PermissionsLayer: FC = ({ children }) => {
  const { t } = useTranslation('bluetooth');

  const [permissions, setPermissions] = useState<boolean>(false);

  useEffect(() => {
    if (Platform.OS === 'ios')
      Geolocation.requestAuthorization('whenInUse').then((results) => {
        if (results === 'granted') setPermissions(true);
      });
  }, [t]);

  useEffect(() => {
    if (Platform.OS === 'android')
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then((isGrantedAlready) => {
        if (isGrantedAlready) setPermissions(true);
        else
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: t('permissions.title'),
              message: t('permissions.message'),
              buttonNeutral: t('permissions.buttonNeutral'),
              buttonNegative: t('permissions.buttonNegative'),
              buttonPositive: t('permissions.buttonPositive'),
            },
          ).then((granted) => {
            if (granted === 'granted') setPermissions(true);
            else setPermissions(false);
          });
      });
  }, [t]);

  return <>{permissions ? children : null}</>;
};
