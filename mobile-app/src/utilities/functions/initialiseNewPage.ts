import { Page } from '@models/app-maker';

export const initialiseNewPage = (): Page => ({
  layout: { rows: 4, columns: 3 },
  scrollEnabled: false,
  boxes: {},
});
