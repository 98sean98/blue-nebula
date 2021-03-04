/**
 * @purpose to type check the main stack navigator, and screens
 * @documentation please see https://reactnavigation.org/docs/typescript/ for expanding the type definition
 */

import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { RootNavigationProp } from '@navigation/navigationTypes';

export type MainDrawerParamList = {
  SimpleController: undefined;
  DevController: undefined;
  Setups: undefined;
  AppMaker: undefined;
  Settings: undefined;
};

type ParentNavigationProp = RootNavigationProp;

type MainScreenProps<T extends keyof MainDrawerParamList> = {
  route: RouteProp<MainDrawerParamList, T>;
  navigation: CompositeNavigationProp<
    DrawerNavigationProp<MainDrawerParamList, T>,
    ParentNavigationProp
  >; // first parameter of CompositeNavigationProp is the primary (navigator owning this screen) type, second parameter is the secondary (parent navigator) type
}; // generic type for both the route and navigation props for a screen

export type SimpleControllerScreenProps = MainScreenProps<'SimpleController'>;

export type DevControllerScreenProps = MainScreenProps<'DevController'>;

export type SetupsScreenProps = MainScreenProps<'Setups'>;

export type AppMakerScreenProps = MainScreenProps<'AppMaker'>;

export type SettingsScreenProps = MainScreenProps<'Settings'>;
