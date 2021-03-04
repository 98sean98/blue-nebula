import { ControlEntityEnum } from './ControlEntityEnum';
import { Enable } from './Enable';

export type DCMotor = {
  name: string;
  type: ControlEntityEnum.DCMotor;
  enable: Enable;
};
