import { BleManager, Device, State } from 'react-native-ble-plx';
import { BleRpiDeviceServicesAndCharacteristics } from '@models/BleRpiDevice';

// types and interfaces for feature
type BleRpiDeviceCharacteristics = keyof BleRpiDeviceServicesAndCharacteristics['characteristics'];

// action payload

export type SetBleManager = BleManager;

export type SetBleManagerState = State;

export type SetIsScanningAndConnecting = boolean;

export type SetIsBleRpiDeviceConnected = boolean;

export type SetBleRpiDeviceServicesCharacteristics = {
  bleRpiDevice: Device;
  bleRpiDeviceServicesAndCharacteristics: BleRpiDeviceServicesAndCharacteristics;
};

export type ReadCharacteristicValueAsync = BleRpiDeviceCharacteristics;

export type WriteCharacteristicValueAsync = BleRpiDeviceCharacteristics;

// feature state
export type BluetoothState = {
  readonly bleManager: BleManager;
  readonly bleManagerState: State;
  readonly isScanningAndConnecting: SetIsScanningAndConnecting;
  readonly isBleRpiDeviceConnected: SetIsBleRpiDeviceConnected;
  readonly bleRpiDevice?: Device;
  readonly bleRpiDeviceServicesAndCharacteristics?: BleRpiDeviceServicesAndCharacteristics;
};
