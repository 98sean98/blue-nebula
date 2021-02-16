import { DeclarableValueType, Value } from '@models/ValueType';

import { parseStringToNumber } from './parseStringToNumber';
import { parseStringToBoolean } from './parseStringToBoolean';

export const parseStringToType = (
  value: string,
  valueType: DeclarableValueType,
): Value | undefined => {
  let parsedValue;

  switch (valueType) {
    case 'string':
      parsedValue = value;
      break;
    case 'number':
      parsedValue = parseStringToNumber(value);
      break;
    case 'boolean':
      parsedValue = parseStringToBoolean(value);
      break;
    default:
  }

  return parsedValue;
};
