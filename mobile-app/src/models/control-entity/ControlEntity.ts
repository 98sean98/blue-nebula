import { StepperMotor } from './StepperMotor';
import { DCMotor } from './DCMotor';
import { BLDCMotor } from './BLDCMotor';
import { Relay } from './Relay';

export type ControlEntity = StepperMotor | DCMotor | BLDCMotor | Relay;
