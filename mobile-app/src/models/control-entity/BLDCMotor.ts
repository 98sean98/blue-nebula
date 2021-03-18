import { ControlEntityEnum } from './ControlEntityEnum';
import { Direction } from './Direction';
import { Enable } from './Enable';
import { Brake } from './Brake';

export type BLDCMotor = {
  name: string;
  type: ControlEntityEnum.BLDCMotor;
  pwmDutyCycle: number;
  pwmFrequency: number;
  direction: Direction;
  enable: Enable;
  brake: Brake;
  duration: number;
};
