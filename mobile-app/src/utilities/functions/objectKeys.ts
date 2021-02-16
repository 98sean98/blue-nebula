import {
  ControlEntityEnum,
  DCMotor,
  StepperMotor,
} from '@models/control-entity';
import { DeclarableValueType } from '@models/ValueType';

export const stepperMotorObjectKeys: Array<{
  key: keyof StepperMotor;
  valueType: DeclarableValueType;
}> = [
  { key: 'name', valueType: 'string' },
  { key: 'pulseInterval', valueType: 'number' },
  { key: 'revolution', valueType: 'number' },
  { key: 'pulsePerRevolution', valueType: 'number' },
  { key: 'direction', valueType: 'number' },
  { key: 'enable', valueType: 'number' },
];

export const dcMotorObjectKeys: Array<{
  key: keyof DCMotor;
  valueType: DeclarableValueType;
}> = [
  { key: 'name', valueType: 'string' },
  { key: 'enable', valueType: 'number' },
];

export const getObjectKeys = (
  controlEntityType: ControlEntityEnum,
): typeof stepperMotorObjectKeys | typeof dcMotorObjectKeys => {
  switch (controlEntityType) {
    case ControlEntityEnum.StepperMotor:
      return stepperMotorObjectKeys;
    case ControlEntityEnum.DCMotor:
      return dcMotorObjectKeys;
    default:
      throw new Error(
        'unhandled control entity type while getting object keys',
      );
  }
};
