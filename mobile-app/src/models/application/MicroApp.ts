import { Merge } from 'type-fest';
import { MicroAppData } from './MicroAppData';

export type MicroApp = {
  id: string;
  name: string;
  activeVersion: number;

  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  updaterId: string;
};

export type MicroAppWithActiveData = Merge<
  MicroApp,
  { activeMicroAppData: MicroAppData }
>;
