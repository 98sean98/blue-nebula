import { ActionNode } from './ActionNode';

export type RootActionNode = Pick<ActionNode, 'children' | 'fullChildrenCount'>;
