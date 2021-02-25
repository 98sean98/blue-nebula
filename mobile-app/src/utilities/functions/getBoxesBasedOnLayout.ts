import { Boxes, Layout } from '@models/app-maker';

export const getBoxesBasedOnLayout = (
  boxes: Boxes,
  { boxCount }: Layout,
): Boxes => {
  const filteredBoxes: Boxes = {};
  for (let i = 0; i < boxCount; i++) filteredBoxes[i] = boxes[i];
  return filteredBoxes;
};
