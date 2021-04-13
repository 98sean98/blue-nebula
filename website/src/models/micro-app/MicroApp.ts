export type MicroApp = {
  id: string;
  name: string;
  activeVersion: number;

  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  updaterId: string;
};
