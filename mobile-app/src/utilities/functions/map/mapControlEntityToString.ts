import { ControlEntity } from '@models/control-entity';
import { mapObjectToStringArray } from '@utilities/functions/map/mapObjectToStringArray';
import { getObjectKeys } from '@utilities/functions/objectKeys';

export const mapControlEntityToString = (
  controlEntity: ControlEntity,
): string => {
  const objectKeys = getObjectKeys(controlEntity.type);
  return mapObjectToStringArray(controlEntity, objectKeys).join(', ');
};
