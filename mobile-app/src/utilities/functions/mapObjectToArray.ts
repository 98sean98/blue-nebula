import { BluetoothValueType } from '@models/BluetoothValueType';

import { parseFromTypeToString } from '@utilities/functions/parse';

export const mapObjectToArray = (
  object: Record<string, string | number | boolean | undefined>,
  objectKeys: Array<{
    key: string;
    valueType: BluetoothValueType;
  }>,
): Array<string> =>
  objectKeys.map(({ key }) => parseFromTypeToString(object[key]));
