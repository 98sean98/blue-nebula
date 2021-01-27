import { BleManager, State } from 'react-native-ble-plx';
import { BluetoothConstants } from './constants';
import { BluetoothState } from './types';
import { BluetoothActionTypes } from './actions';

const initialState: BluetoothState = {
  bleManager: new BleManager(),
  bleManagerState: State.Unknown,
  isScanningAndConnecting: false,
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
    case BluetoothConstants.SET_IS_BLE_RPI_DEVICE_CONNECTED:
      return { ...state, isBleRpiDeviceConnected: action.payload };
    case BluetoothConstants.SET_BLE_RPI_DEVICE_SERVICES_CHARACTERISTICS:
      const {
        bleRpiDevice,
        bleRpiDeviceServicesAndCharacteristics,
      } = action.payload;
      return { ...state, bleRpiDevice, bleRpiDeviceServicesAndCharacteristics };
    default:
      // saga actions would just return the state
      return state;
  }
};
