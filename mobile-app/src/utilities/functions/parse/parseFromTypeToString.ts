import { Value } from '@models/ValueType';

export const parseFromTypeToString = (value: Value | undefined): string => {
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
    case 'undefined':
      stringValue = '';
      break;
    default:
      throw new Error(
        'the value is an invalid data type, valid types are string, number, boolean, or undefined',
      );
  }

  return stringValue;
};
