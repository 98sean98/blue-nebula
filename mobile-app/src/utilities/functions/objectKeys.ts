import { StepperMotor } from '@models/control-entity';
import { DeclarableValueType } from '@models/ValueType';

export const stepMotorObjectKeys: Array<{
  key: keyof StepperMotor;
  valueType: DeclarableValueType;
}> = [
  { key: 'name', valueType: 'string' },
  { key: 'pulseInterval', valueType: 'number' },
  { key: 'degree', valueType: 'number' },
  { key: 'direction', valueType: 'number' },
  { key: 'enable', valueType: 'number' },
];
