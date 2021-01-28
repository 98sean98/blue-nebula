import { Characteristic, Service } from 'react-native-ble-plx';
import { RpiDevice } from '@config/RpiDevice';

const rpiDevice = new RpiDevice();

export type BleRpiDeviceServicesAndCharacteristics = {
  service: Service;
  characteristics: Record<
    keyof typeof rpiDevice.characteristicUUIDs,
    Characteristic
  >;
};
