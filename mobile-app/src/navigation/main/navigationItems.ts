import { MainDrawerParamList } from '@navigation/main/navigationTypes';
import { ApplicationMode } from '@models/application';

export const navigationItems: Array<{
  routeName: keyof MainDrawerParamList;
  text: string;
  iconName: string;
  screenParams?: Record<string, unknown>;
}> = [
  {
    routeName: 'SimpleController',
    text: 'Simple Controller',
    iconName: 'grid-outline',
  },
  {
    routeName: 'DevController',
    text: 'Dev Controller',
    iconName: 'flash-outline',
  },
  {
    routeName: 'Setups',
    text: 'Setups',
    iconName: 'file-text-outline',
  },
  {
    routeName: 'AppMaker',
    text: 'App Maker',
    iconName: 'cube-outline',
  },
  { routeName: 'Settings', text: 'Settings', iconName: 'settings-2-outline' },
];

export const getNavigationItems = (
  applicationMode: ApplicationMode,
): typeof navigationItems => {
  const normalModeScreens: Array<keyof MainDrawerParamList> = [
    'SimpleController',
    'Settings',
  ];
  if (applicationMode !== ApplicationMode.GAME_MASTER)
    return navigationItems.filter(({ routeName }) =>
      normalModeScreens.includes(routeName),
    );
  return navigationItems;
};
