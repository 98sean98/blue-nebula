export type MicroApp = {
  id: string;
  name: string;
  version: number;

  data: string;

  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  updaterId: string;
};
