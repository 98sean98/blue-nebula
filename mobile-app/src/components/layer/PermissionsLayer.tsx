import React, { FC, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

export const PermissionsLayer: FC = ({ children }) => {
  const { t } = useTranslation('bluetooth');

  const [
    androidBluetoothPermissions,
    setAndroidBluetoothPermissions,
  ] = useState<boolean>(false);

  useEffect(() => {
    if (Platform.OS === 'android')
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then((isGrantedAlready) => {
        if (isGrantedAlready) setAndroidBluetoothPermissions(true);
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
            if (granted === 'granted') setAndroidBluetoothPermissions(true);
            else setAndroidBluetoothPermissions(false);
          });
      });
  }, [t]);

  return (
    <>
      {Platform.OS === 'ios' ||
      (Platform.OS === 'android' && androidBluetoothPermissions)
        ? children
        : null}
    </>
  );
};
