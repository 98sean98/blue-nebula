import { StepperMotor } from './StepperMotor';
import { DCMotor } from './DCMotor';
import { BLDCMotor } from './BLDCMotor';

export type ControlEntity = StepperMotor | DCMotor | BLDCMotor;
