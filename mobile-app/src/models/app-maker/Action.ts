import { Setups } from '@models/setup';

export type Action = {
  boxKeys: Array<string>;
  setupKey?: keyof Setups;
};
