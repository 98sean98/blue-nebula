import { buffers, eventChannel } from 'redux-saga';
import { cancelled, select, take, cancel, put } from '@redux-saga/core/effects';
import { BleError, Device } from 'react-native-ble-plx';

import {
  setIsBleRpiDeviceConnected,
  setIsMonitoringBleRpiDeviceConnection,
  stopMonitoringConnection,
} from '../actions';
import { BluetoothState } from '../types';

import { RootState } from '@reduxApp/rootReducer';

export function* monitorConnection(): Generator<any, void> {
  const bluetoothState = yield select((state: RootState) => state.bluetooth);
  const {
    isBleRpiDeviceConnected,
    bleRpiDevice,
  } = bluetoothState as BluetoothState;

  if (!isBleRpiDeviceConnected || typeof bleRpiDevice === 'undefined') {
    console.log(
      'device is not connected, therefore connection monitoring cannot be initialised',
    );
    // kill the start connection task itself
    yield put(stopMonitoringConnection());
    return;
  }

  yield put(setIsMonitoringBleRpiDeviceConnection(true));
  console.log('started monitoring device connection!');

  const monitoringChannel: any = yield eventChannel((emit) => {
    const subscription = bleRpiDevice.onDisconnected((error, device) => {
      emit([error, device]);
    });
    return () => {
      console.log('stopped monitoring device connection!');
      subscription.remove();
    };
  }, buffers.expanding(1));

  try {
    for (;;) {
      const monitorResults = yield take(monitoringChannel);
      const [error] = monitorResults as [BleError, Device];
      console.log('device has been disconnected due to:', error);
      yield put(setIsBleRpiDeviceConnected(false));
      yield cancel();
    }
  } catch (error) {
    console.log('caught unknown error while monitoring the device:', error);
    yield cancel();
  } finally {
    if (yield cancelled()) {
      monitoringChannel.close();
      yield put(setIsMonitoringBleRpiDeviceConnection(false));
      yield put(stopMonitoringConnection());
    }
  }
}
