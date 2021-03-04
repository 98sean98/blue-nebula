import { ValueOf } from 'type-fest';

import { ActionNode } from './ActionNode';

export type ActionTreePath = Array<ValueOf<ActionNode, 'boxKey'>>;
