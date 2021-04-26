import { ControlEntityEnum } from './ControlEntityEnum';
import { Direction } from './Direction';
import { Enable } from './Enable';

export type DCMotor = {
  name: string;
  type: ControlEntityEnum.DCMotor;
  pwmDutyCycle: number;
  pwmFrequency: number;
  direction: Direction;
  enable: Enable;
  duration: number;
};
