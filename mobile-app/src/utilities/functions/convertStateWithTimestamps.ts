import {
  ConvertibleObject,
  convertObjectWithTimestampKeys,
} from './convertObjectWithTimestampKeys';

export type ConvertibleState = Record<string, ConvertibleObject>;

export const convertStateWithTimestamps = (
  state: ConvertibleState,
  keys: Array<string>,
): ConvertibleState => {
  const array = Object.entries(state).map(([objectKey, object]) => {
    const convertedObject = convertObjectWithTimestampKeys(object, keys);
    return { key: objectKey, object: convertedObject };
  });

  const convertedState: ConvertibleState = {};
  array.forEach(({ key, object }) => (convertedState[key] = object));

  return convertedState;
};
