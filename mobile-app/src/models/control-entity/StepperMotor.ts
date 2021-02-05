import { Direction } from './Direction';
import { Enable } from './Enable';

export type StepperMotor = {
  name: string;
  pulseInterval: number;
  degree: number;
  direction: Direction;
  enable: Enable;
};
