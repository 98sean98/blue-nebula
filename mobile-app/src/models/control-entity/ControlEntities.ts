import { ControlEntity } from './ControlEntity';
import { ControlEntityEnum } from './ControlEntityEnum';

export type ControlEntities = Record<string, ControlEntity>;

export const declaredControlEntities: ControlEntities = {
  wheelMotor: {
    name: 'wheel_motor',
    type: ControlEntityEnum.StepperMotor,
    pulseInterval: 150,
    revolution: 200,
    pulsePerRevolution: 500,
    direction: 0,
    enable: 0,
  },
  screwMotor: {
    name: 'screw_motor',
    type: ControlEntityEnum.StepperMotor,
    pulseInterval: 150,
    revolution: 200,
    pulsePerRevolution: 500,
    direction: 0,
    enable: 0,
  },
};
