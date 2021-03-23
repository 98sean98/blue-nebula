import { createContext } from 'react';
import { ActionTreePath } from '@models/app-maker';

interface SimpleControllerContextType {
  actionTreePath: ActionTreePath;
}

const initialSimpleControllerContext: SimpleControllerContextType = {
  actionTreePath: [],
};

export const SimpleControllerContext = createContext<SimpleControllerContextType>(
  initialSimpleControllerContext,
);
