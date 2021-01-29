import { BluetoothConstants } from './constants';

import {
  ReadCharacteristicValueAsync,
  SetBleManager,
  SetBleManagerState,
  SetBleRpiDeviceServicesCharacteristics,
  SetIsBleRpiDeviceConnected,
  SetIsScanningAndConnecting,
  WriteCharacteristicValueAsync,
} from './types';

export const setBleManager = (payload: SetBleManager) =>
  ({ type: BluetoothConstants.SET_BLE_MANAGER, payload } as const);

export const setBleManagerState = (payload: SetBleManagerState) =>
  ({ type: BluetoothConstants.SET_BLE_MANAGER_STATE, payload } as const);

export const setIsBleRpiDeviceConnected = (
  payload: SetIsBleRpiDeviceConnected,
) =>
  ({
    type: BluetoothConstants.SET_IS_BLE_RPI_DEVICE_CONNECTED,
    payload,
  } as const);

export const setBleRpiDeviceServicesCharacteristics = (
  payload: SetBleRpiDeviceServicesCharacteristics,
) =>
  ({
    type: BluetoothConstants.SET_BLE_RPI_DEVICE_SERVICES_CHARACTERISTICS,
    payload,
  } as const);

export const connectAsync = () =>
  ({ type: BluetoothConstants.CONNECT_ASYNC } as const);

export const cancelConnect = () =>
  ({ type: BluetoothConstants.CANCEL_CONNECT } as const);

export const setIsScanningConnecting = (payload: SetIsScanningAndConnecting) =>
  ({
    type: BluetoothConstants.SET_IS_SCANNING_AND_CONNECTING,
    payload,
  } as const);

export const readCharacteristicValueAsync = (
  payload: ReadCharacteristicValueAsync,
) =>
  ({
    type: BluetoothConstants.READ_CHARACTERISTIC_VALUE_ASYNC,
    payload,
  } as const);

export const writeCharacteristicValueAsync = (
  payload: WriteCharacteristicValueAsync,
) =>
  ({
    type: BluetoothConstants.WRITE_CHARACTERISTIC_VALUE_ASYNC,
    payload,
  } as const);

/**
 * @description union of all the actions by using ReturnType to get the return type of each function
 * @guide https://www.carlrippon.com/managing-app-state-with-redux-and-typescript-p1/
 */

export type SetBleManagerBluetoothAction = ReturnType<typeof setBleManager>;
export type SetBleManagerStateBluetoothAction = ReturnType<
  typeof setBleManagerState
>;
export type SetIsBleRpiDeviceConnectedBluetoothAction = ReturnType<
  typeof setIsBleRpiDeviceConnected
>;
export type SetBleRpiDeviceServicesCharacteristicsBluetoothAction = ReturnType<
  typeof setBleRpiDeviceServicesCharacteristics
>;

export type ConnectAsyncBluetoothAction = ReturnType<typeof connectAsync>;
export type CancelConnectBluetoothAction = ReturnType<typeof cancelConnect>;
export type SetIsScanningAndConnectingBluetoothAction = ReturnType<
  typeof setIsScanningConnecting
>;
export type ReadCharacteristicValueAsyncBluetoothAction = ReturnType<
  typeof readCharacteristicValueAsync
>;
export type WriteCharacteristicValueAsyncBluetoothAction = ReturnType<
  typeof writeCharacteristicValueAsync
>;

export type BluetoothActionTypes =
  | SetBleManagerBluetoothAction
  | SetBleManagerStateBluetoothAction
  | SetIsBleRpiDeviceConnectedBluetoothAction
  | SetBleRpiDeviceServicesCharacteristicsBluetoothAction
  | ConnectAsyncBluetoothAction
  | CancelConnectBluetoothAction
  | SetIsScanningAndConnectingBluetoothAction
  | ReadCharacteristicValueAsyncBluetoothAction
  | WriteCharacteristicValueAsyncBluetoothAction;
