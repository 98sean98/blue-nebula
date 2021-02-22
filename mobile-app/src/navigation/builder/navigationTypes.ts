/**
 * @purpose to type check the builder stack navigator, and screens
 * @documentation please see https://reactnavigation.org/docs/typescript/ for expanding the type definition
 */

import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootNavigationProp } from '@navigation/navigationTypes';

import { Setups } from '@models/setup';

export type BuilderStackParamList = {
  NewControlEntity: undefined;
  SetupForm: { keyOfSetupToBeEdited?: keyof Setups };
};

type ParentNavigationProp = RootNavigationProp;

type BuilderScreenProps<T extends keyof BuilderStackParamList> = {
  route: RouteProp<BuilderStackParamList, T>;
  navigation: CompositeNavigationProp<
    StackNavigationProp<BuilderStackParamList, T>,
    ParentNavigationProp
  >; // first parameter of CompositeNavigationProp is the primary (navigator owning this screen) type, second parameter is the secondary (parent navigator) type
}; // generic type for both the route and navigation props for a screen

export type NewControlEntityScreenProps = BuilderScreenProps<
  'NewControlEntity'
>;

export type SetupFormScreenProps = BuilderScreenProps<'SetupForm'>;
