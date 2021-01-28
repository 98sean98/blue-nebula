import { BleManager, Device } from 'react-native-ble-plx';

export const bleConnect = async (
  bleManager: BleManager,
  deviceId: string,
): Promise<Device> =>
  await bleManager.connectToDevice(deviceId, {
    autoConnect: true,
  });
