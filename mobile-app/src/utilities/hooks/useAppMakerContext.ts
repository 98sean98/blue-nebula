import { useContext } from 'react';

import { AppMakerContext } from '@utilities/context/AppMakerContext';

export const useAppMakerContext = () => useContext(AppMakerContext);
