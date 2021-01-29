import { Characteristic, Service } from 'react-native-ble-plx';
import { RpiDevice } from '@config/RpiDevice';

const rpiDevice = new RpiDevice();

export type BleRpiDeviceCharacteristicKeys = keyof typeof rpiDevice.characteristicUUIDs;

export type BleRpiDeviceServicesAndCharacteristics = {
  service: Service;
  characteristics: Record<BleRpiDeviceCharacteristicKeys, Characteristic>;
};
