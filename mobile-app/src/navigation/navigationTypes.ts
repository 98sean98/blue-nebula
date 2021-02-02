/**
 * @purpose to type check the root stack navigator, and screens
 * @documentation please see https://reactnavigation.org/docs/typescript/ for expanding the type definition
 */

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  DevController: undefined;
  SimpleController: undefined;
};

type RootScreenProps<T extends keyof RootStackParamList> = {
  route: RouteProp<RootStackParamList, T>;
  navigation: StackNavigationProp<RootStackParamList, T>;
}; // generic type for both the route and navigation props for a screen

export type DevControllerScreenProps = RootScreenProps<'DevController'>;

export type SimpleControllerScreenProps = RootScreenProps<'SimpleController'>;
