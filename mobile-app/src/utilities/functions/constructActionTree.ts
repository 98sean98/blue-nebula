import { ActionNode, Actions, Pages } from '@models/app-maker';

/**
 * @description construct an action tree recursively
 */

export const constructActionTree = (
  pages: Pages,
  passedPageIndex?: number,
): Actions | undefined => {
  const pageIndex = passedPageIndex ?? 0; // initialise as 0

  // base case (the last page has been constructed)
  if (pageIndex === Object.keys(pages).length) return undefined;

  // recursion
  const actions: Actions = [];
  const { boxes } = pages[pageIndex];
  Object.keys(boxes).forEach((boxKey) => {
    const actionNode: ActionNode = {
      boxKey,
      // construct the children of this action node with the boxes in the next page
      children: constructActionTree(pages, pageIndex + 1),
    };
    // put this action node into the array
    actions.push(actionNode);
  });

  return actions;
};
