import { PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';

export const getPressableStyle = (
  { pressed }: PressableStateCallbackType,
  style?: {
    pressed?: StyleProp<ViewStyle>;
    additional?: StyleProp<ViewStyle>;
  },
): StyleProp<ViewStyle> => [
  pressed ? style?.pressed : {},
  typeof style?.additional === 'object' ? style?.additional : {},
];
