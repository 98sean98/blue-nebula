export type MicroAppData = {
  id: string;
  name: string | undefined;
  version: number;

  data: string;

  createdAt: Date;
  creatorId: string;
};
