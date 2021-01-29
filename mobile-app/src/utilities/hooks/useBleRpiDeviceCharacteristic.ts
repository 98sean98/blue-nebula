import { useDispatch, useSelector } from 'react-redux';
import * as base64 from 'base-64';

import { BleRpiDeviceCharacteristicKeys } from '@models/BleRpiDevice';

import { RootState } from '@reduxApp/rootReducer';
import { Characteristic } from 'react-native-ble-plx';
import { setBleRpiDeviceServicesCharacteristics } from '@reduxApp/bluetooth/actions';

type ValueType = 'string' | 'number' | 'boolean';

type UseBleRpiDeviceCharacteristic = {
  read: () => Promise<string | number | boolean>;
  write: (value: string | number | boolean) => Promise<void>;
};

export function useBleRpiDeviceCharacteristic(
  characteristicKey: BleRpiDeviceCharacteristicKeys,
  valueType: ValueType,
): UseBleRpiDeviceCharacteristic {
  const { bleRpiDeviceServicesAndCharacteristics } = useSelector(
    (state: RootState) => state.bluetooth,
  );
  const dispatch = useDispatch();

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
    if (!returnedCharacteristic?.value) throw new Error('value is undefined');

    // save the newly returned characteristic in redux
    dispatch(
      setBleRpiDeviceServicesCharacteristics({
        bleRpiDeviceServicesAndCharacteristics: {
          characteristics: {
            [characteristicKey]: returnedCharacteristic,
          },
        },
      }),
    );

    const decoded = base64.decode(returnedCharacteristic.value);

    switch (valueType) {
      case 'string':
        return decoded;
      case 'number':
        return parseFloat(decoded);
      case 'boolean':
        return decoded === '1';
      default:
        return decoded;
    }
  };

  const write: UseBleRpiDeviceCharacteristic['write'] = async (value) => {
    const characteristic = getCharacteristic();

    let stringValue: string;

    switch (typeof value) {
      case 'string':
        stringValue = value;
        break;
      case 'number':
        stringValue = value.toString();
        break;
      case 'boolean':
        stringValue = value ? '1' : '0';
        break;
      default:
        throw new Error('the value is not a string, nor a number');
    }

    const encoded = base64.encode(stringValue);

    if (characteristic.isWritableWithResponse)
      await characteristic.writeWithResponse(encoded);
    else if (characteristic.isWritableWithoutResponse)
      await characteristic.writeWithoutResponse(encoded);
    else throw new Error('characteristic could not be written');
  };

  return { read, write };
}
