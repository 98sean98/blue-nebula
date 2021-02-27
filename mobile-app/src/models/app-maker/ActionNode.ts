import { Setups } from '@models/setup';
import { Boxes } from './Boxes';

export type ActionNode = {
  boxKey: keyof Boxes;
  children?: Array<ActionNode>;
  fullChildrenCount?: number;
  setupKey?: keyof Setups; // if the setup key exists, this action node is considered the last
};
