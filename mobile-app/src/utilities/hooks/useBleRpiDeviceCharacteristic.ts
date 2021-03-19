import { useState } from 'react';
import { Characteristic, Subscription } from 'react-native-ble-plx';
import { useSelector } from 'react-redux';
import * as base64 from 'base-64';

import { BleRpiDeviceCharacteristicKeys } from '@models/BleRpiDevice';
import { DeclarableValueType, Value } from '@models/ValueType';

import { RootState } from '@reduxApp/rootReducer';
import {
  parseFromTypeToString,
  parseStringToType,
} from '@utilities/functions/parse';

type UseBleRpiDeviceCharacteristic = {
  read: () => Promise<Value>;
  write: (value: Value) => Promise<void>;
  monitor: {
    start: (decipherMonitorValue?: (rawValue: string) => Value) => void;
    stop: () => void;
    isMonitoring: boolean;
    value: Value | undefined;
  };
};

export function useBleRpiDeviceCharacteristic(
  characteristicKey: BleRpiDeviceCharacteristicKeys,
  valueType: DeclarableValueType,
): UseBleRpiDeviceCharacteristic {
  const { bleRpiDeviceServicesAndCharacteristics } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  const getCharacteristic = (): Characteristic => {
    if (typeof bleRpiDeviceServicesAndCharacteristics === 'undefined')
      throw new Error(
        'bluetooth device services and characteristics could not be found, please reconnect to device',
      );

    const characteristics =
      bleRpiDeviceServicesAndCharacteristics.characteristics;
    return characteristics[characteristicKey];
  };

  const read: UseBleRpiDeviceCharacteristic['read'] = async () => {
    const characteristic = getCharacteristic();

    if (!characteristic.isReadable)
      throw new Error('characteristic could not be read');

    const returnedCharacteristic = await characteristic.read();
    if (!returnedCharacteristic?.value)
      throw new Error('read value is undefined');

    const decoded = base64.decode(returnedCharacteristic.value);

    const value = parseStringToType(decoded, valueType);

    return value ?? '';
  };

  const write: UseBleRpiDeviceCharacteristic['write'] = async (value) => {
    const characteristic = getCharacteristic();

    const stringValue = parseFromTypeToString(value);

    const encoded = base64.encode(stringValue);

    if (characteristic.isWritableWithResponse)
      await characteristic.writeWithResponse(encoded);
    else if (characteristic.isWritableWithoutResponse)
      await characteristic.writeWithoutResponse(encoded);
    else throw new Error('characteristic could not be written');
  };

  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [monitoredValue, setMonitoredValue] = useState<Value>();
  const [
    monitorSubscription,
    setMonitorSubscription,
  ] = useState<Subscription>();

  const start: UseBleRpiDeviceCharacteristic['monitor']['start'] = (
    decipherMonitorValue,
  ) => {
    const characteristic = getCharacteristic();

    if (!characteristic.isNotifiable)
      throw new Error('characteristic is not notifiable');

    const newSubscription = characteristic.monitor(
      (error, returnedCharacteristic) => {
        if (error !== null)
          throw new Error(`${error.errorCode}: ${error.message}`);

        if (!returnedCharacteristic?.value)
          throw new Error('read value is undefined');

        const decoded = base64.decode(returnedCharacteristic.value);

        const value =
          typeof decipherMonitorValue !== 'undefined'
            ? decipherMonitorValue(decoded)
            : parseStringToType(decoded, valueType);

        setMonitoredValue(value);
      },
    );

    setIsMonitoring(true);
    setMonitoredValue(undefined);
    setMonitorSubscription(newSubscription);
  };

  const stop: UseBleRpiDeviceCharacteristic['monitor']['stop'] = () => {
    if (typeof monitorSubscription !== 'undefined') {
      monitorSubscription.remove();
      setMonitorSubscription(undefined);
    }
    setIsMonitoring(false);
  };

  return {
    read,
    write,
    monitor: { start, stop, isMonitoring, value: monitoredValue },
  };
}
