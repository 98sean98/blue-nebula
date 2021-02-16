import { DeclarableValueType, Value } from '@models/ValueType';

export const initialiseValueOfType = (
  valueType: DeclarableValueType,
): Value => {
  switch (valueType) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
  }
};
