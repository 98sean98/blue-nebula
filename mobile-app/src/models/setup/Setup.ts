import { ControlEntities } from '@models/control-entity/ControlEntities';

export type Setup = {
  name: string;
  description?: string;
  fields: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  controlEntitiesState: ControlEntities;
  countdownTimer?: number; // in seconds
};
