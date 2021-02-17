import { DeclarableValueType } from '@models/ValueType';
import { KeyboardType } from 'react-native';

export const getKeyboardType = (
  valueType: DeclarableValueType,
): KeyboardType => {
  switch (valueType) {
    case 'string':
      return 'default';
    case 'number':
      return 'numeric';
    default:
      throw new Error('unhandled value type for keyboard in ui');
  }
};
