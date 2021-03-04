import { ActionNode, RootActionNode } from '@models/app-maker';
import { Setups } from '@models/setup';

// recursively remove setup key from every node

export const replaceSetupKeyInActionTree = (
  actionTree: RootActionNode | ActionNode,
  setupKey: keyof Setups,
  newSetupKey: keyof Setups | undefined, // setting undefined effectively removes the setup key
): void => {
  // remove the setup key by setting it to undefined
  if (
    typeof (actionTree as ActionNode).setupKey !== 'undefined' &&
    (actionTree as ActionNode).setupKey === setupKey
  )
    (actionTree as ActionNode).setupKey = newSetupKey;

  // traverse the tree through its children
  const { children } = actionTree;

  // base case
  if (typeof children === 'undefined' || children.length === 0) return;

  // for loop
  children.forEach((childNode) =>
    replaceSetupKeyInActionTree(childNode, setupKey, newSetupKey),
  );
};
