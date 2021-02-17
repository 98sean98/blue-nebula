import {
  ControlEntityEnum,
  DCMotor,
  StepperMotor,
} from '@models/control-entity';
import { DeclarableValueType } from '@models/ValueType';

export const stepperMotorObjectKeys: Array<{
  key: keyof StepperMotor;
  valueType: DeclarableValueType;
  description: string;
}> = [
  { key: 'name', valueType: 'string', description: 'a unique name' },
  {
    key: 'pulseInterval',
    valueType: 'number',
    description:
      'time delay between pulses in microseconds (the lower this value, the faster the motor runs)',
  },
  {
    key: 'revolution',
    valueType: 'number',
    description: 'rotational distance traversed by the motor',
  },
  {
    key: 'pulsePerRevolution',
    valueType: 'number',
    description: 'number of pulses per revolution',
  },
  {
    key: 'direction',
    valueType: 'number',
    description: '0 - clockwise, 1 - counter-clockwise',
  },
  { key: 'enable', valueType: 'number', description: '0 - Low, 1 - High' },
];

export const dcMotorObjectKeys: Array<{
  key: keyof DCMotor;
  valueType: DeclarableValueType;
  description: string;
}> = [
  { key: 'name', valueType: 'string', description: 'a unique name' },
  {
    key: 'enable',
    valueType: 'number',
    description: '0 - disable, 1 - enable',
  },
];

export const getObjectKeys = (
  controlEntityType: ControlEntityEnum,
): Array<{
  key: keyof StepperMotor | keyof DCMotor;
  valueType: DeclarableValueType;
  description: string;
}> => {
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
