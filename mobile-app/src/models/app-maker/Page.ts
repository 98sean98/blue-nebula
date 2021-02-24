import { Layout } from './Layout';
import { Box } from './Box';

export type Page = {
  layout: Layout;
  scrollEnabled: boolean;
  boxes: Record<string, Box>;
};
