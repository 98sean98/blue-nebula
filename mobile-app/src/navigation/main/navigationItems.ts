import {
  MainDrawerParamList,
  SetupsMode,
} from '@navigation/main/navigationTypes';

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
    screenParams: { mode: SetupsMode.Normal },
  },
  { routeName: 'Settings', text: 'Settings', iconName: 'settings-2-outline' },
];
