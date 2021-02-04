import { Characteristic } from 'react-native-ble-plx';
import { useSelector } from 'react-redux';
import * as base64 from 'base-64';

import { BleRpiDeviceCharacteristicKeys } from '@models/BleRpiDevice';
import { DeclarableValueType } from '@models/ValueType';

import { RootState } from '@reduxApp/rootReducer';
import {
  parseFromTypeToString,
  parseStringToType,
} from '@utilities/functions/parse';

type UseBleRpiDeviceCharacteristic = {
  read: () => Promise<string | number | boolean>;
  write: (value: string | number | boolean) => Promise<void>;
};

export function useBleRpiDeviceCharacteristic(
  characteristicKey: BleRpiDeviceCharacteristicKeys,
  valueType: DeclarableValueType,
): UseBleRpiDeviceCharacteristic {
  const { bleRpiDeviceServicesAndCharacteristics } = useSelector(
    (state: RootState) => state.bluetooth,
  );

  const getCharacteristic = (): Characteristic => {
    if (!bleRpiDeviceServicesAndCharacteristics)
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

  return { read, write };
}
