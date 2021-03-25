import { useContext } from 'react';
import { SimpleControllerContext } from '@utilities/context/SimpleControllerContext';

export const useSimpleControllerContext = () =>
  useContext(SimpleControllerContext);
