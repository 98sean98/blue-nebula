export type MicroAppDataUsageLog = {
  id: string;

  simpleUserId: string;

  microAppDataId: string;

  timestamp: Date;

  locationLatitude: number | undefined;
  locationLongitude: number | undefined;
};
