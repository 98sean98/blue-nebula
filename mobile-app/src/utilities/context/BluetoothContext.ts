import { createContext } from 'react';
import { BleManager, State } from 'react-native-ble-plx';

interface BluetoothContextType {
  bleManager: BleManager;
  bleManagerState: State;
}

const defaultBluetoothContext: BluetoothContextType = {
  bleManager: new BleManager(),
  bleManagerState: State.Unknown,
};

export const BluetoothContext = createContext<BluetoothContextType>(
  defaultBluetoothContext,
);
