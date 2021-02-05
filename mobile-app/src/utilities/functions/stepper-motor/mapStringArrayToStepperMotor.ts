import { mapArrayToObject } from '@utilities/functions/mapArrayToObject';
import { stepMotorObjectKeys } from '@utilities/functions/objectKeys';

export const mapStringArrayToStepperMotor = (stringArray: Array<string>) =>
  mapArrayToObject(stringArray, stepMotorObjectKeys);
