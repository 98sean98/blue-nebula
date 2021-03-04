import { ControlEntityEnum } from './ControlEntityEnum';
import { Direction } from './Direction';
import { Enable } from './Enable';

export type StepperMotor = {
  name: string;
  type: ControlEntityEnum.StepperMotor;
  pulseInterval: number;
  revolution: number;
  pulsePerRevolution: number;
  direction: Direction;
  enable: Enable;
};
