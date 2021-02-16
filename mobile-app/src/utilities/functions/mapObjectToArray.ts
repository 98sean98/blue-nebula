import { DeclarableValueType, Value } from '@models/ValueType';

import { parseFromTypeToString } from '@utilities/functions/parse';

export const mapObjectToArray = (
  object: Record<string, Value | undefined>,
  objectKeys: Array<{
    key: string;
    valueType: DeclarableValueType;
  }>,
): Array<string> =>
  objectKeys.map(({ key }) => parseFromTypeToString(object[key]));
