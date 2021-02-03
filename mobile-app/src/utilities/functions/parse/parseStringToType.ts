import { parseStringToNumber } from './parseStringToNumber';
import { parseStringToBoolean } from './parseStringToBoolean';

export const parseStringToType = (
  value: string,
  valueType: 'string' | 'number' | 'boolean',
): string | number | boolean | undefined => {
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
