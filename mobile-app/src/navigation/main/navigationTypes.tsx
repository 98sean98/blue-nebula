/**
 * @purpose to type check the main stack navigator, and screens
 * @documentation please see https://reactnavigation.org/docs/typescript/ for expanding the type definition
 */

import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootNavigationProp } from '@navigation/navigationTypes';

export type MainStackParamList = {
  DevController: undefined;
  SimpleController: undefined;
  Settings: undefined;
};

type ParentNavigationProp = RootNavigationProp;

type MainScreenProps<T extends keyof MainStackParamList> = {
  route: RouteProp<MainStackParamList, T>;
  navigation: CompositeNavigationProp<
    StackNavigationProp<MainStackParamList, T>,
    ParentNavigationProp
  >; // first parameter of CompositeNavigationProp is the primary (navigator owning this screen) type, second parameter is the secondary (parent navigator) type
}; // generic type for both the route and navigation props for a screen

export type DevControllerScreenProps = MainScreenProps<'DevController'>;

export type SimpleControllerScreenProps = MainScreenProps<'SimpleController'>;

export type SettingsScreenProps = MainScreenProps<'Settings'>;
