import { Layout } from './Layout';
import { Box } from './Box';
import { PageStyles } from './PageStyles';

export type Page = {
  layout: Layout;
  scrollEnabled: boolean;
  boxes: Record<string, Box>;
  styles: PageStyles;
};
