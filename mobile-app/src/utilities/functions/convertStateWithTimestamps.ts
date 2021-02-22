import moment from 'moment';

export type ConvertibleState = Record<string, Record<string, any>>;

export const convertStateWithTimestamps = (
  state: ConvertibleState,
  keys: Array<string>,
): ConvertibleState => {
  const array = Object.entries(state).map(([objectKey, object]) => {
    keys.forEach((key) => {
      if (
        typeof object[key] !== 'undefined' &&
        typeof object[key] === 'string' &&
        moment(object[key]).isValid()
      ) {
        object[key] = moment(object[key]).toDate();
      }
    });
    return { key: objectKey, object };
  });

  const convertedState: ConvertibleState = {};
  array.forEach(({ key, object }) => (convertedState[key] = object));

  return convertedState;
};
