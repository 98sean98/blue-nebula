import { ActionNode, RootActionNode } from '@models/app-maker';

// recursively checks if the action tree is populated
// being populated means having all its children being populated, and that the ideal children count is equal to the length of the children list
// if the action tree is simply a leaf, i.e. it has no children, being populated means having its setup key defined

export const checkIfActionTreeIsPopulated = (
  actionTree: RootActionNode | ActionNode,
): boolean => {
  const { children, fullChildrenCount } = actionTree;
  const { setupKey } = actionTree as ActionNode; // setup key on the root action node is always undefined

  if (typeof children === 'undefined' || children.length === 0)
    return typeof setupKey !== 'undefined';

  return (
    children.length === fullChildrenCount &&
    children.every((child) => checkIfActionTreeIsPopulated(child))
  );
};
