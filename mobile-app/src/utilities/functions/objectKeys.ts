import {
  BLDCMotor,
  ControlEntityEnum,
  DCMotor,
  Relay,
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
  { key: 'enable', valueType: 'number', description: '0 - low, 1 - high' },
];

export const dcMotorObjectKeys: Array<{
  key: keyof DCMotor;
  valueType: DeclarableValueType;
  description: string;
}> = [
  { key: 'name', valueType: 'string', description: 'a unique name' },
  {
    key: 'pwmDutyCycle',
    valueType: 'number',
    description: 'pwm output (0 - 100)',
  },
  {
    key: 'pwmFrequency',
    valueType: 'number',
    description: 'cycle frequency (should be around 1000)',
  },
  {
    key: 'direction',
    valueType: 'number',
    description: '0 - clockwise, 1 - counter-clockwise',
  },
  {
    key: 'enable',
    valueType: 'number',
    description: '0 - disable, 1 - enable',
  },
  {
    key: 'duration',
    valueType: 'number',
    description: 'motor running duration',
  },
];

export const bldcMotorObjectKeys: Array<{
  key: keyof BLDCMotor;
  valueType: DeclarableValueType;
  description: string;
}> = [
  { key: 'name', valueType: 'string', description: 'a unique name' },
  {
    key: 'pwmDutyCycle',
    valueType: 'number',
    description: 'pwm output (0 - 100)',
  },
  {
    key: 'pwmFrequency',
    valueType: 'number',
    description: 'cycle frequency (should be around 1000)',
  },
  {
    key: 'direction',
    valueType: 'number',
    description: '0 - clockwise, 1 - counter-clockwise',
  },
  { key: 'enable', valueType: 'number', description: '0 - low, 1 - high' },
  { key: 'brake', valueType: 'number', description: '0 - low, 1 - high' },
  {
    key: 'duration',
    valueType: 'number',
    description: 'motor running duration',
  },
];

export const relayObjectKeys: Array<{
  key: keyof Relay;
  valueType: DeclarableValueType;
  description: string;
}> = [
  { key: 'name', valueType: 'string', description: 'a unique name' },
  {
    key: 'gpioState',
    valueType: 'number',
    description: 'gpio state: 0 - low, 1 - high',
  },
  {
    key: 'enable',
    valueType: 'number',
    description: '0 - disable, 1 - enable',
  },
  {
    key: 'permanentChange',
    valueType: 'boolean',
    description:
      'if true, gpio state change does not revert to previous state after running is stopped',
  },
  {
    key: 'duration',
    valueType: 'number',
    description: 'relay running duration',
  },
];

export const getObjectKeys = (
  controlEntityType: ControlEntityEnum,
): Array<{
  key: keyof StepperMotor | keyof DCMotor | keyof BLDCMotor | keyof Relay;
  valueType: DeclarableValueType;
  description: string;
}> => {
  switch (controlEntityType) {
    case ControlEntityEnum.StepperMotor:
      return stepperMotorObjectKeys;
    case ControlEntityEnum.DCMotor:
      return dcMotorObjectKeys;
    case ControlEntityEnum.BLDCMotor:
      return bldcMotorObjectKeys;
    case ControlEntityEnum.Relay:
      return relayObjectKeys;
    default:
      throw new Error(
        'unhandled control entity type while getting object keys',
      );
  }
};
