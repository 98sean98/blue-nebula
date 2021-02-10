import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useBleRpiDeviceCharacteristic } from './useBleRpiDeviceCharacteristic';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';
import { SetControlEntities } from '@reduxApp/control/types';

import { DeclarableValueType } from '@models/ValueType';

import { checkIfObjectValuesAreDefined } from '@utilities/functions/checkIfObjectValuesAreDefined';
import {
  mapStepperMotorToString,
  mapStringArrayToStepperMotor,
} from '@utilities/functions/stepper-motor';

import { parseStringToType } from '@utilities/functions/parse';

type UseControlEntities = {
  readAll: () => Promise<void>;
  writeAll: () => Promise<void>;
  setControlEntityByParameter: (
    entity: string,
    param: string,
    value: string,
    valueType: DeclarableValueType,
  ) => void;
};

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
      wheelMotor: mapStringArrayToStepperMotor(
        stepMotorStringArray.slice(0, 6),
      ),
      // screwMotor: mapStringArrayToStepperMotor(
      //   stepMotorStringArray.slice(6, 12),
      // ),
    };

    dispatch(setControlEntities(newControlEntities));
  }, [dispatch, readStepMotors]);

  const writeAll: UseControlEntities['writeAll'] = useCallback(async () => {
    const strings = [
      checkIfObjectValuesAreDefined(controlEntities.wheelMotor)
        ? mapStepperMotorToString(controlEntities.wheelMotor)
        : '',
      checkIfObjectValuesAreDefined(controlEntities.screwMotor)
        ? mapStepperMotorToString(controlEntities.screwMotor)
        : '',
    ];

    for (const string of strings) {
      if (string.length > 0) await writeStepMotor(string);
    }
  }, [controlEntities, writeStepMotor]);

  const setControlEntityByParameter: UseControlEntities['setControlEntityByParameter'] = (
    entity,
    param,
    value,
    valueType,
  ) => {
    dispatch(
      setControlEntities({
        [entity]: {
          [param]: parseStringToType(value, valueType),
        },
      }),
    );
  };

  return {
    readAll,
    writeAll,
    setControlEntityByParameter,
  };
};
