import { Characteristic, Service } from 'react-native-ble-plx';

export type BleRpiDeviceServicesAndCharacteristics = {
  robotControllerService: Service;
  characteristics: {
    motorSpeed1Characteristic: Characteristic;
  };
};
