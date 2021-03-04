/**
 * @purpose to type check the root stack navigator, and screens
 * @documentation please see https://reactnavigation.org/docs/typescript/ for expanding the type definition
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { MainDrawerParamList } from '@navigation/main';
import { BuilderStackParamList } from '@navigation/builder';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainDrawerParamList>;
  Builder: NavigatorScreenParams<BuilderStackParamList>;
};

export type RootNavigationProp = StackNavigationProp<RootStackParamList>;

export type MainScreenProps = StackScreenProps<RootStackParamList, 'Main'>;
