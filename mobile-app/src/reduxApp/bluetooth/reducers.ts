import { BleManager, State } from 'react-native-ble-plx';

import { BluetoothConstants } from './constants';
import { BluetoothState } from './types';
import { BluetoothActionTypes } from './actions';

import { BleRpiDeviceServicesAndCharacteristics } from '@models/BleRpiDevice';

const initialState: BluetoothState = {
  bleManager: new BleManager(),
  bleManagerState: State.Unknown,
  isScanningAndConnecting: false,
  isMonitoringBleRpiDeviceConnection: false,
  isBleRpiDeviceConnected: false,
};

export const bluetoothReducer = (
  state = initialState,
  action: BluetoothActionTypes,
): BluetoothState => {
  switch (action.type) {
    case BluetoothConstants.SET_BLE_MANAGER:
      return { ...state, bleManager: action.payload };
    case BluetoothConstants.SET_BLE_MANAGER_STATE:
      return { ...state, bleManagerState: action.payload };
    case BluetoothConstants.SET_IS_SCANNING_AND_CONNECTING:
      return { ...state, isScanningAndConnecting: action.payload };
    case BluetoothConstants.SET_IS_MONITORING_BLE_RPI_DEVICE_CONNECTION:
      return { ...state, isMonitoringBleRpiDeviceConnection: action.payload };
    case BluetoothConstants.SET_IS_BLE_RPI_DEVICE_CONNECTED:
      return { ...state, isBleRpiDeviceConnected: action.payload };
    case BluetoothConstants.SET_BLE_RPI_DEVICE_SERVICES_CHARACTERISTICS:
      const {
        bleRpiDevice,
        bleRpiDeviceServicesAndCharacteristics,
      } = action.payload;
      const combinedBleRpiDeviceServicesAndCharacteristics = {
        ...state.bleRpiDeviceServicesAndCharacteristics,
        service:
          bleRpiDeviceServicesAndCharacteristics?.service ||
          state.bleRpiDeviceServicesAndCharacteristics?.service,
        characteristics: {
          ...state.bleRpiDeviceServicesAndCharacteristics?.characteristics,
          ...bleRpiDeviceServicesAndCharacteristics?.characteristics,
        },
      };
      return {
        ...state,
        bleRpiDevice:
          typeof bleRpiDevice !== 'undefined'
            ? bleRpiDevice
            : state.bleRpiDevice,
        bleRpiDeviceServicesAndCharacteristics:
          // check if the combined state has keys
          Object.keys(combinedBleRpiDeviceServicesAndCharacteristics).length > 0
            ? // it is safe to take the combined state to be fully populated with services and characteristics as this reducer should never be called if the device is not connected
              (combinedBleRpiDeviceServicesAndCharacteristics as BleRpiDeviceServicesAndCharacteristics)
            : state.bleRpiDeviceServicesAndCharacteristics,
      };
    default:
      // saga actions would just return the state
      return state;
  }
};
