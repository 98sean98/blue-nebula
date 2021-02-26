import React, { FC, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export const PermissionsLayer: FC = ({ children }) => {
  const [
    androidBluetoothPermissions,
    setAndroidBluetoothPermissions,
  ] = useState<boolean>(false);

  useEffect(() => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then((isGrantedAlready) => {
      if (isGrantedAlready) setAndroidBluetoothPermissions(true);
      else
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission Localisation Bluetooth',
            message: 'Requirement for Bluetooth',
            buttonNeutral: 'Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        ).then((granted) => {
          if (granted === 'granted') setAndroidBluetoothPermissions(true);
          else setAndroidBluetoothPermissions(false);
        });
    });
  }, []);

  return (
    <>
      {Platform.OS === 'ios' ||
      (Platform.OS === 'android' && androidBluetoothPermissions)
        ? children
        : null}
    </>
  );
};
