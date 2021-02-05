import { StepperMotor } from '@models/control-entity';
import { mapObjectToArray } from '@utilities/functions/mapObjectToArray';
import { stepMotorObjectKeys } from '@utilities/functions/objectKeys';

export const mapStepperMotorToString = (stepperMotor: StepperMotor): string =>
  mapObjectToArray(stepperMotor, stepMotorObjectKeys).join(', ');
