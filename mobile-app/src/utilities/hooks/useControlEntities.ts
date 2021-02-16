import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { camelCase } from 'change-case';

import { useBleRpiDeviceCharacteristic } from './useBleRpiDeviceCharacteristic';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';
import { SetControlEntities } from '@reduxApp/control/types';

import { ControlEntityEnum } from '@models/control-entity';
import { DeclarableValueType } from '@models/ValueType';

import { checkIfObjectValuesAreDefined } from '@utilities/functions/checkIfObjectValuesAreDefined';
import {
  mapControlEntityToString,
  mapStringArrayToControlEntity,
} from '@utilities/functions/map';

import { parseStringToType } from '@utilities/functions/parse';
import { getObjectKeys } from '@utilities/functions/objectKeys';

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
    read: readStepperMotors,
    write: writeStepperMotor,
  } = useBleRpiDeviceCharacteristic('stepperMotors', 'string');

  const readAll: UseControlEntities['readAll'] = useCallback(async () => {
    // decipher string into control entity objects
    const stepperMotorString = (await readStepperMotors()) as string;
    const stepperMotorStringArray = stepperMotorString.split(', ');

    const objectKeysCount = getObjectKeys(ControlEntityEnum.StepperMotor)
      .length;

    const newControlEntities: SetControlEntities = {};

    for (let i = 0; i < stepperMotorStringArray.length / objectKeysCount; i++) {
      const stringArray = stepperMotorStringArray.slice(
        i * objectKeysCount,
        (i + 1) * objectKeysCount,
      );
      const entity = camelCase(stringArray[0]);
      newControlEntities[entity] = mapStringArrayToControlEntity(
        stringArray,
        ControlEntityEnum.StepperMotor,
      );
    }

    dispatch(setControlEntities(newControlEntities));
  }, [dispatch, readStepperMotors]);

  const writeAll: UseControlEntities['writeAll'] = useCallback(async () => {
    const stepperMotorStrings: Array<string> = Object.values(
      controlEntities,
    ).map((controlEntity) =>
      controlEntity.type === ControlEntityEnum.StepperMotor &&
      checkIfObjectValuesAreDefined(controlEntity)
        ? mapControlEntityToString(controlEntity)
        : '',
    );

    for (const string of stepperMotorStrings) {
      if (string.length > 0) await writeStepperMotor(string);
    }
  }, [controlEntities, writeStepperMotor]);

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
