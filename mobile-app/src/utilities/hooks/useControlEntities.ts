import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useBleRpiDeviceCharacteristic } from './useBleRpiDeviceCharacteristic';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';
import { SetControlEntities } from '@reduxApp/control/types';

import { mapArrayToObject } from '@utilities/functions/mapArrayToObject';
import { mapObjectToArray } from '@utilities/functions/mapObjectToArray';
import { checkIfObjectValuesAreDefined } from '@utilities/functions/checkIfObjectValuesAreDefined';

type UseControlEntities = {
  readAll: () => Promise<void>;
  writeAll: () => Promise<void>;
};

const stepMotorObjectKeys: Parameters<typeof mapArrayToObject>[1] = [
  { key: 'name', valueType: 'string' },
  { key: 'pulseInterval', valueType: 'number' },
  { key: 'degree', valueType: 'number' },
  { key: 'direction', valueType: 'number' },
  { key: 'enable', valueType: 'number' },
];

export const useControlEntities = (): UseControlEntities => {
  const dispatch = useDispatch();

  const { controlEntities } = useSelector((state: RootState) => state.control);

  const {
    read: readStepMotors,
    write: writeStepMotor,
  } = useBleRpiDeviceCharacteristic('stepMotors', 'string');

  const readAll: UseControlEntities['readAll'] = useCallback(async () => {
    const stepMotorString = (await readStepMotors()) as string;
    // decipher string into control entity object
    const stepMotorStringArray = stepMotorString.split(', ');

    const newControlEntities: SetControlEntities = {
      wheelMotor: mapArrayToObject(
        stepMotorStringArray.slice(0, 5),
        stepMotorObjectKeys,
      ),
      screwMotor: mapArrayToObject(
        stepMotorStringArray.slice(5, 10),
        stepMotorObjectKeys,
      ),
    };

    dispatch(setControlEntities(newControlEntities));
  }, [dispatch, readStepMotors]);

  const writeAll: UseControlEntities['writeAll'] = useCallback(async () => {
    const strings = [
      checkIfObjectValuesAreDefined(controlEntities.wheelMotor)
        ? mapObjectToArray(
            controlEntities.wheelMotor,
            stepMotorObjectKeys,
          ).join(', ')
        : '',
      checkIfObjectValuesAreDefined(controlEntities.screwMotor)
        ? mapObjectToArray(
            controlEntities.screwMotor,
            stepMotorObjectKeys,
          ).join(', ')
        : '',
    ];

    for (const string of strings) {
      if (string.length > 0) await writeStepMotor(string);
    }
  }, [controlEntities, writeStepMotor]);

  return { readAll, writeAll };
};
