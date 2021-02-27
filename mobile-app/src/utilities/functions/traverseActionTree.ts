import { ActionNode, ActionTreePath, RootActionNode } from '@models/app-maker';

// recursively traverse the tree

export const traverseActionTree = (
  actionTree: RootActionNode | ActionNode,
  path: ActionTreePath,
): RootActionNode | ActionNode => {
  const { children } = actionTree;

  if (
    path.length === 0 ||
    typeof children === 'undefined' ||
    children.length === 0
  )
    return actionTree;

  // get the next node of this tree based on the path
  const key = path[0];
  const childNode = children.find(({ boxKey }) => boxKey === key);

  // throw error if childNode is not found
  if (typeof childNode === 'undefined')
    throw new Error(
      `child action node of key ${key} cannot be found in the tree`,
    );

  // remove the first item in the path
  const slicedPath = path.slice(1);

  return traverseActionTree(childNode, slicedPath);
};
