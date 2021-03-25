import { MainDrawerParamList } from '@navigation/main/navigationTypes';
import { ApplicationMode } from '@models/application';

export const navigationItems: Array<{
  routeName: keyof MainDrawerParamList;
  iconName: string;
  screenParams?: Record<string, unknown>;
}> = [
  {
    routeName: 'SimpleController',

    iconName: 'grid-outline',
  },
  {
    routeName: 'DevController',

    iconName: 'flash-outline',
  },
  {
    routeName: 'Setups',
    iconName: 'file-text-outline',
  },
  {
    routeName: 'AppMaker',

    iconName: 'cube-outline',
  },
  {
    routeName: 'MicroApp',
    iconName: 'smartphone-outline',
  },
  { routeName: 'Settings', iconName: 'settings-2-outline' },
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
