import { DeclarableValueType, Value } from '@models/ValueType';

import { parseStringToType } from '@utilities/functions/parse';

export const mapStringArrayToObject = (
  values: Array<string>,
  objectKeys: Array<{
    key: string;
    valueType: DeclarableValueType;
  }>,
) => {
  if (values.length !== objectKeys.length)
    throw new Error(
      'mapArrayToObject does not receive the same number of elements in the values array, and the objectKeys array',
    );

  const object: Record<string, Value | undefined> = {};

  objectKeys.forEach(({ key, valueType }, index) => {
    const rawValue = values[index];
    object[key] = parseStringToType(rawValue, valueType);
  });

  return object;
};
