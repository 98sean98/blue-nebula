import { BleManager, Device } from 'react-native-ble-plx';
import { call } from 'redux-saga/effects';

const connectToDevice = async (
  bleManager: BleManager,
  deviceId: string,
): Promise<Device> =>
  await bleManager.connectToDevice(deviceId, { autoConnect: true });

export function* bleConnect(
  bleManager: BleManager,
  deviceId: string,
): Generator<any, Device | undefined> {
  try {
    const device = yield call(connectToDevice, bleManager, deviceId);
    console.log('successfully connected to device!');
    return device as Device;
  } catch (error) {
    console.log('error connecting to device:', error);
  }
}
