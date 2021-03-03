import { ActionNode, RootActionNode } from '@models/app-maker';

// recursively checks if the action tree leads to a setup
// being able to lead to a setup means having at least one of its children lead to a setup
// if the action tree is simply a leaf, i.e. it has no children, being able to lead to a setup means having its setup key defined

export const checkIfActionTreeLeadsToSetup = (
  actionTree: RootActionNode | ActionNode,
): boolean => {
  const { children } = actionTree;
  const { setupKey } = actionTree as ActionNode; // setup key on the root action node is always undefined

  if (typeof children === 'undefined' || children.length === 0)
    return typeof setupKey !== 'undefined';

  return children.some((child) => checkIfActionTreeLeadsToSetup(child));
};
