import { Page, Boxes, Layout } from '@models/app-maker';
import { initialiseNewBox } from './initialiseNewBox';

export const initialiseNewPage = (): Page => {
  const layout: Layout = { rows: 4, columns: 3 };

  const boxes: Boxes = {};
  const boxCount = layout.rows * layout.columns;
  Array(boxCount)
    .fill(null)
    .forEach((_, index) => {
      boxes[index] = initialiseNewBox();
    });

  return {
    layout,
    scrollEnabled: false,
    boxes,
  };
};
