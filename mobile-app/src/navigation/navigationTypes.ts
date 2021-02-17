/**
 * @purpose to type check the root stack navigator, and screens
 * @documentation please see https://reactnavigation.org/docs/typescript/ for expanding the type definition
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { MainStackParamList } from '@navigation/main';
import { BuilderStackParamList } from '@navigation/builder';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList>;
  Builder: NavigatorScreenParams<BuilderStackParamList>;
};

export type RootNavigationProp = StackNavigationProp<RootStackParamList>;
