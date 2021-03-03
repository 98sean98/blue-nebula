import { ActionNode, ActionTreePath, RootActionNode } from '@models/app-maker';

// recursively traverse the tree

export const traverseActionTree = (
  actionTree: RootActionNode | ActionNode,
  path: ActionTreePath,
): RootActionNode | ActionNode | undefined => {
  const { children } = actionTree;

  // the path has been fully traversed, return the action tree
  if (path.length === 0) return actionTree;
  // the path has not been fully traversed but the action tree has no children, return undefined
  else if (typeof children === 'undefined' || children.length === 0)
    return undefined;

  // get the next node of this tree based on the path
  const key = path[0];
  const childNode = children.find(({ boxKey }) => boxKey === key);

  // if the child node cannot be found, it means the tree cannot be traversed correctly based on the given path, return undefined
  if (typeof childNode === 'undefined') return undefined;

  // remove the first item in the path
  const slicedPath = path.slice(1);

  return traverseActionTree(childNode, slicedPath);
};
