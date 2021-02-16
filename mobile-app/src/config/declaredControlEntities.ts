import { ControlEntity, ControlEntityEnum } from '@models/control-entity';

export type DeclaredControlEntities = Record<string, ControlEntity>;

export const declaredControlEntities: DeclaredControlEntities = {
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
