import { ControlEntityEnum } from '@models/control-entity';

import { SetControlEntities } from '@reduxApp/control/types';

import { mapStringArrayToControlEntity } from './mapStringArrayToControlEntity';
import { getObjectKeys } from '@utilities/functions/objectKeys';

export const mapStringToControlEntities = (
  string: string,
  controlEntityType: ControlEntityEnum,
) => {
  const stringArray = string.split(', ');

  const objectKeysCount = getObjectKeys(controlEntityType).length;

  const newControlEntities: SetControlEntities = {};

  for (let i = 0; i < stringArray.length / objectKeysCount; i++) {
    const controlEntityStringArray = stringArray.slice(
      i * objectKeysCount,
      (i + 1) * objectKeysCount,
    );
    const entity = controlEntityStringArray[0];
    newControlEntities[entity] = {
      ...mapStringArrayToControlEntity(
        controlEntityStringArray,
        controlEntityType,
      ),
      type: controlEntityType,
    };
  }

  return newControlEntities;
};
