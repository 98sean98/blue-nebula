import { mapStringArrayToObject } from '@utilities/functions/map/mapStringArrayToObject';
import { getObjectKeys } from '@utilities/functions/objectKeys';
import { ControlEntityEnum } from '@models/control-entity';

export const mapStringArrayToControlEntity = (
  stringArray: Array<string>,
  controlEntityType: ControlEntityEnum,
) => {
  const objectKeys = getObjectKeys(controlEntityType);
  return mapStringArrayToObject(stringArray, objectKeys);
};
