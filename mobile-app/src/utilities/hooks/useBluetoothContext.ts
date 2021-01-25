import { useContext } from 'react';
import { BluetoothContext } from '@utilities/context/BluetoothContext';

export const useBluetoothContext = () => useContext(BluetoothContext);
