import { Direction } from './Direction';
import { Enable } from './Enable';

export type StepperMotor = {
  name: string;
  pulseInterval: number;
  revolution: number;
  pulsePerRevolution: number;
  direction: Direction;
  enable: Enable;
};
