import { ControlEntityEnum } from './ControlEntityEnum';
import { GPIOState } from './GPIOState';
import { Enable } from './Enable';

export type Relay = {
  name: string;
  type: ControlEntityEnum.Relay;
  gpioState: GPIOState;
  enable: Enable;
  permanentChange: boolean;
  duration: number;
};
