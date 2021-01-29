import { Characteristic, Device, Service } from 'react-native-ble-plx';

import { SetBleRpiDeviceServicesCharacteristics } from '../types';

import { RpiDevice } from '@config/RpiDevice';

export const bleGetServicesAndCharacteristics = async (
  bleRpiDevice: Device,
): Promise<SetBleRpiDeviceServicesCharacteristics> => {
  const rpiDevice = new RpiDevice();

  const device = await bleRpiDevice?.discoverAllServicesAndCharacteristics();
  const services = await device?.services();

  const foundService: Service | undefined = services?.find(
    (service) => service.uuid === rpiDevice.serviceUUID,
  );

  if (!foundService)
    throw new Error('robot controller service cannot be found');

  const characteristics = await foundService.characteristics();

  const mappedCharacteristics: Record<string, Characteristic> = {};
  for (const [key, uuid] of Object.entries(rpiDevice.characteristicUUIDs)) {
    const foundCharacteristic = characteristics.find(
      (characteristic) => characteristic.uuid === uuid,
    );
    if (!foundCharacteristic) throw new Error(`missing characteristic: ${key}`);
    mappedCharacteristics[key] = foundCharacteristic;
  }

  return {
    bleRpiDevice: device,
    bleRpiDeviceServicesAndCharacteristics: {
      service: foundService,
      characteristics: mappedCharacteristics,
    },
  };
};
