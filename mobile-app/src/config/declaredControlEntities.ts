import { StepperMotor } from '@models/control-entity';

export type DeclaredControlEntities = {
  wheelMotor: StepperMotor;
  screwMotor: StepperMotor;
};

export const declaredControlEntities: DeclaredControlEntities = {
  wheelMotor: {
    name: 'wheel_motor',
    pulseInterval: 0,
    degree: 0,
    direction: 0,
    enable: 0,
  },
  screwMotor: {
    name: 'screw_motor',
    pulseInterval: 0,
    degree: 0,
    direction: 0,
    enable: 0,
  },
};
