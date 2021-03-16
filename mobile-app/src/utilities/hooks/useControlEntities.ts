import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useBleRpiDeviceCharacteristic } from './useBleRpiDeviceCharacteristic';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';

import { ControlEntityEnum } from '@models/control-entity';
import { DeclarableValueType } from '@models/ValueType';

import { checkIfObjectValuesAreDefined } from '@utilities/functions/checkIfObjectValuesAreDefined';
import {
  mapControlEntityToString,
  mapStringToControlEntities,
} from '@utilities/functions/map';

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
    read: readStepperMotors,
    write: writeStepperMotor,
  } = useBleRpiDeviceCharacteristic('stepperMotors', 'string');
  const {
    read: readBLDCMotors,
    write: writeBLDCMotor,
  } = useBleRpiDeviceCharacteristic('bldcMotors', 'string');

  const readAll: UseControlEntities['readAll'] = useCallback(async () => {
    // decipher strings into control entity objects
    const stepperMotorString = (await readStepperMotors()) as string;
    const bldcMotorString = (await readBLDCMotors()) as string;
    const newStepperMotors = mapStringToControlEntities(
      stepperMotorString,
      ControlEntityEnum.StepperMotor,
    );
    const newBLDCMotors = mapStringToControlEntities(
      bldcMotorString,
      ControlEntityEnum.BLDCMotor,
    );

    const newControlEntities = { ...newStepperMotors, ...newBLDCMotors };

    dispatch(setControlEntities(newControlEntities));
  }, [dispatch, readStepperMotors, readBLDCMotors]);

  const writeAll: UseControlEntities['writeAll'] = useCallback(async () => {
    const stepperMotorStrings: Array<string> = [];
    const bldcMotorStrings: Array<string> = [];

    Object.values(controlEntities).forEach((controlEntity) => {
      if (checkIfObjectValuesAreDefined(controlEntity)) {
        const string = mapControlEntityToString(controlEntity);
        switch (controlEntity.type) {
          case ControlEntityEnum.StepperMotor:
            stepperMotorStrings.push(string);
            break;
          case ControlEntityEnum.BLDCMotor:
            bldcMotorStrings.push(string);
            break;
          default:
            break;
        }
      }
    });

    for (const string of stepperMotorStrings) {
      await writeStepperMotor(string);
    }
    for (const string of bldcMotorStrings) {
      await writeBLDCMotor(string);
    }
  }, [controlEntities, writeStepperMotor, writeBLDCMotor]);

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
