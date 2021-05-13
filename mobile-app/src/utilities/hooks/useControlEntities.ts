import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useBleRpiDeviceCharacteristic } from './useBleRpiDeviceCharacteristic';

import { RootState } from '@reduxApp';
import {
  clearAllControlEntities,
  setControlEntities,
} from '@reduxApp/control/actions';

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
    read: readDCMotors,
    write: writeDCMotor,
  } = useBleRpiDeviceCharacteristic('dcMotors', 'string');
  const {
    read: readBLDCMotors,
    write: writeBLDCMotor,
  } = useBleRpiDeviceCharacteristic('bldcMotors', 'string');
  const { read: readRelays, write: writeRelay } = useBleRpiDeviceCharacteristic(
    'relays',
    'string',
  );

  const readAll: UseControlEntities['readAll'] = useCallback(async () => {
    // decipher strings into control entity objects
    const stepperMotorString = (await readStepperMotors()) as string;
    const dcMotorString = (await readDCMotors()) as string;
    const bldcMotorString = (await readBLDCMotors()) as string;
    const relayString = (await readRelays()) as string;
    const newStepperMotors = mapStringToControlEntities(
      stepperMotorString,
      ControlEntityEnum.StepperMotor,
    );
    const newDCMotors = mapStringToControlEntities(
      dcMotorString,
      ControlEntityEnum.DCMotor,
    );
    const newBLDCMotors = mapStringToControlEntities(
      bldcMotorString,
      ControlEntityEnum.BLDCMotor,
    );
    const newRelays = mapStringToControlEntities(
      relayString,
      ControlEntityEnum.Relay,
    );

    const newControlEntities = {
      ...newStepperMotors,
      ...newDCMotors,
      ...newBLDCMotors,
      ...newRelays,
    };

    dispatch(clearAllControlEntities());
    dispatch(setControlEntities(newControlEntities));
  }, [dispatch, readStepperMotors, readDCMotors, readBLDCMotors, readRelays]);

  const writeAll: UseControlEntities['writeAll'] = useCallback(async () => {
    const stepperMotorStrings: Array<string> = [];
    const dcMotorStrings: Array<string> = [];
    const bldcMotorStrings: Array<string> = [];
    const relayStrings: Array<string> = [];

    Object.values(controlEntities).forEach((controlEntity) => {
      if (checkIfObjectValuesAreDefined(controlEntity)) {
        const string = mapControlEntityToString(controlEntity);
        switch (controlEntity.type) {
          case ControlEntityEnum.StepperMotor:
            stepperMotorStrings.push(string);
            break;
          case ControlEntityEnum.DCMotor:
            dcMotorStrings.push(string);
            break;
          case ControlEntityEnum.BLDCMotor:
            bldcMotorStrings.push(string);
            break;
          case ControlEntityEnum.Relay:
            relayStrings.push(string);
            break;
          default:
            break;
        }
      }
    });

    for (const string of stepperMotorStrings) {
      await writeStepperMotor(string);
    }
    for (const string of dcMotorStrings) {
      await writeDCMotor(string);
    }
    for (const string of bldcMotorStrings) {
      await writeBLDCMotor(string);
    }
    for (const string of relayStrings) {
      await writeRelay(string);
    }
  }, [
    controlEntities,
    writeStepperMotor,
    writeDCMotor,
    writeBLDCMotor,
    writeRelay,
  ]);

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
